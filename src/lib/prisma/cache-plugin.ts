import { getRedisClient, isRedisConnected } from "@/lib/cache/redis";
import conf from "@/lib/config";
import { logger } from "@/lib/logger";
import { Prisma } from "@/lib/prisma/generated/client";

const redis = getRedisClient();
const baseKey = encodeURIComponent(conf.host);

type CachedAction = "findUnique" | "findFirst" | "findMany" | "count" | "aggregate";
type MutatingAction =
  | "create"
  | "update"
  | "upsert"
  | "delete"
  | "createMany"
  | "updateMany"
  | "deleteMany";

type CacheConfig = {
  ttlSeconds?: number;
  cacheActions?: Partial<Record<string, CachedAction[]>>; // model -> read actions to cache
  globalActions?: CachedAction[];
  key?(params: { model: string; action: CachedAction; args: unknown }): string;
  shouldCache?(params: {
    model: string;
    action: CachedAction;
    args: unknown;
    result: unknown;
  }): boolean;
  invalidateOn?: Partial<Record<string, MutatingAction[]>>; // model -> write actions that nuke cache
  globalInvalidations?: MutatingAction[];
  invalidateKeys?(params: {
    model: string;
    action: MutatingAction;
    args: unknown;
    cacheKeys: Set<string>;
  }): Iterable<string> | Promise<Iterable<string>>;
};

type ActionResult =
  | { type: "cached"; operation: CachedAction }
  | { type: "mutating"; operation: MutatingAction }
  | { type: "unknown"; operation: "unknown" };

const defaultKey = ({
  model,
  action,
  args,
}: {
  model: string;
  action: string;
  args: unknown;
}): string => {
  const base = `${baseKey}:${model}:${action}`;
  const userId = extractUserId(args);

  if (userId) {
    return `${base}:userId:${userId}:${JSON.stringify(args)}`;
  }

  return `${base}:${JSON.stringify(args)}`;
};

function extractUserId(args: unknown): string | null {
  if (typeof args !== "object" || args === null) return null;

  const obj = args as Record<string, unknown>;

  // Check where first (for queries and updates)
  if (obj.where) {
    const userId = findUserIdRecursive(obj.where, 0);
    if (userId) return userId;
  }

  // Check data (for create/update operations)
  if (obj.data) {
    const userId = findUserIdRecursive(obj.data, 0);
    if (userId) return userId;
  }

  return null;
}

function findUserIdRecursive(value: unknown, depth: number): string | null {
  if (depth > 5) return null;

  if (typeof value !== "object" || value === null) return null;

  const obj = value as Record<string, unknown>;
  if (obj.userId && typeof obj.userId === "string") {
    return obj.userId;
  }

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const result = findUserIdRecursive(obj[key], depth + 1);
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}

export const withRedisCache = (config: CacheConfig) => {
  const {
    ttlSeconds = 60,
    cacheActions = {},
    globalActions = ["findUnique", "findFirst", "findMany"],
    key = defaultKey,
    shouldCache = () => true,
    invalidateOn = {},
    globalInvalidations = [
      "create",
      "update",
      "delete",
      "upsert",
      "createMany",
      "updateMany",
      "deleteMany",
    ],
    invalidateKeys = ({ cacheKeys }) => cacheKeys,
  } = config;

  const collectKeys = async (
    model: string,
    action: MutatingAction,
    args: unknown,
    userId: string | null
  ) => {
    if (!isRedisConnected(redis)) return new Set<string>();

    // Extract prefix from key function by generating a sample key
    const sampleKey = key({
      model,
      action: "findUnique" as CachedAction,
      args: { where: { id: "sample" } },
    });
    // Extract prefix: "${baseKey}:QuizSession:findUnique:" -> "${baseKey}:"
    const prefixMatch = sampleKey.match(/^([^:]+:)/);
    const prefix = prefixMatch ? prefixMatch[1] : "";

    // Build pattern to match keys for this model
    // If userId is present, only match keys with that userId
    const pattern = userId
      ? `${prefix}${model}:*:userId:${userId}:*`
      : `${prefix}${model}:*`;

    const cacheKeys = new Set<string>();
    let cursor = "0";

    do {
      const result = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = result[0];
      for (const key of result[1]) {
        cacheKeys.add(key);
      }
    } while (cursor !== "0");

    return invalidateKeys({ model, action, args, cacheKeys });
  };

  const getAction = (operation: string): ActionResult => {
    if (globalActions.includes(operation as CachedAction))
      return { type: "cached", operation: operation as CachedAction };
    if (globalInvalidations.includes(operation as MutatingAction))
      return { type: "mutating", operation: operation as MutatingAction };
    return { type: "unknown", operation: "unknown" };
  };

  return Prisma.defineExtension((client) =>
    client.$extends({
      query: {
        async $allOperations({
          model,
          operation,
          args,
          query,
        }: {
          model?: string;
          operation: string;
          args: unknown;
          query: (args: unknown) => Promise<unknown>;
        }) {
          if (!model) return query(args);

          if (!isRedisConnected(redis)) {
            logger.debug("Redis not configured, falling back to database");
            return query(args);
          }

          const userId = extractUserId(args);
          const action = getAction(operation);

          if (action.type === "cached") {
            const actionsForModel = cacheActions[model] ?? [];
            const shouldCacheAction =
              actionsForModel.includes(action.operation) ||
              globalActions.includes(action.operation);

            if (!shouldCacheAction) return query(args);

            const cacheKey = key({ model, action: action.operation, args });
            const cached = await redis.get(cacheKey);

            if (cached) {
              logger.debug(`Redis cache HIT for key: ${cacheKey}`);
              return JSON.parse(cached);
            } else {
              logger.debug(`Redis cache MISS for key: ${cacheKey}`);
            }

            const result = await query(args);

            if (shouldCache({ model, action: action.operation, args, result })) {
              await redis.set(cacheKey, JSON.stringify(result), "EX", ttlSeconds);
            }

            return result;
          } else if (action.type === "mutating") {
            const modelInvalidations = invalidateOn[model] ?? [];
            const shouldInvalidate =
              modelInvalidations.includes(action.operation) ||
              globalInvalidations.includes(action.operation);

            if (!shouldInvalidate) return query(args);

            const result = await query(args);

            logger.debug(
              `INVALIDATE cache for model: ${model}, action: ${action.operation}, userId: ${userId ?? "none"}, args: ${JSON.stringify(args)}`
            );

            const keysToInvalidate = await collectKeys(
              model,
              action.operation,
              args,
              userId
            );
            for await (const cacheKey of keysToInvalidate) {
              await redis.del(cacheKey);
            }

            return result;
          } else {
            return query(args);
          }
        },
      } as never,
    })
  );
};

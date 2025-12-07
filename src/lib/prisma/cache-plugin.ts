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

type KeyParams = {
  model: string;
  action: CachedAction;
  args: unknown;
};

type ShouldCacheParams = {
  model: string;
  action: CachedAction;
  args: unknown;
  result: unknown;
};

type InvalidateKeysParams = {
  model: string;
  action: MutatingAction;
  args: unknown;
  cacheKeys: Set<string>;
};

type CacheConfig = {
  ttlSeconds?: number;
  cacheActions?: Partial<Record<string, CachedAction[]>>; // model -> read actions to cache
  globalActions?: CachedAction[];
  key?(params: KeyParams): string;
  shouldCache?(params: ShouldCacheParams): boolean;
  invalidateOn?: Partial<Record<string, MutatingAction[]>>; // model -> write actions that nuke cache
  globalInvalidations?: MutatingAction[];
  invalidateKeys?(
    params: InvalidateKeysParams
  ): Iterable<string> | Promise<Iterable<string>>;
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

const getAction = (
  operation: string,
  globalActions: CachedAction[],
  globalInvalidations: MutatingAction[]
): ActionResult => {
  if (globalActions.includes(operation as CachedAction))
    return { type: "cached", operation: operation as CachedAction };
  if (globalInvalidations.includes(operation as MutatingAction))
    return { type: "mutating", operation: operation as MutatingAction };
  return { type: "unknown", operation: "unknown" };
};

const collectKeys = async (
  model: string,
  action: MutatingAction,
  args: unknown,
  userId: string | null,
  key: (params: KeyParams) => string,
  invalidateKeys: (
    params: InvalidateKeysParams
  ) => Iterable<string> | Promise<Iterable<string>>
) => {
  if (!isRedisConnected(redis)) return new Set<string>();

  // Extract prefix from key function by generating a sample key
  const sampleKey = key({
    model,
    action: "findUnique" as CachedAction,
    args: { where: { id: "sample" } },
  });
  // Extract prefix: "${baseKey}:QuizSession:findUnique:" -> "${baseKey}:"
  const prefixMatch = /^([^:]+:)/.exec(sampleKey);
  const prefix = prefixMatch ? prefixMatch[1] : "";

  // Build pattern to match keys for this model
  // If userId is present, only match keys with that userId
  const pattern = userId
    ? `${prefix}${model}:*:userId:${userId}:*`
    : `${prefix}${model}:*`;

  const cacheKeys = new Set<string>();
  let cursor = "0";

  try {
    do {
      const result = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = result[0];
      for (const key of result[1]) {
        cacheKeys.add(key);
      }
    } while (cursor !== "0");
  } catch (error) {
    logger.warn(
      `Failed to scan cache keys for pattern ${pattern}: ${error instanceof Error ? error.message : String(error)}. Returning partial results.`
    );
  }

  return invalidateKeys({ model, action, args, cacheKeys });
};

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
          const action = getAction(operation, globalActions, globalInvalidations);

          if (action.type === "cached") {
            const actionsForModel = cacheActions[model] ?? [];
            const shouldCacheAction =
              actionsForModel.includes(action.operation) ||
              globalActions.includes(action.operation);

            if (!shouldCacheAction) return query(args);

            const cacheKey = key({ model, action: action.operation, args });
            let cached: string | null = null;
            try {
              cached = await redis.get(cacheKey);
            } catch (_error) {
              logger.warn(
                `Failed to get cache key: ${cacheKey}, falling back to database`
              );
            }

            if (cached) {
              logger.debug(`Redis cache HIT for key: ${cacheKey}`);
              try {
                return JSON.parse(cached);
              } catch (_error) {
                logger.warn(
                  `Invalid cached data for key: ${cacheKey}, falling back to database`
                );
                try {
                  await redis.del(cacheKey);
                } catch (_error) {
                  logger.warn(`Failed to delete invalid cache key: ${cacheKey}`);
                }
              }
            } else {
              logger.debug(`Redis cache MISS for key: ${cacheKey}`);
            }

            const result = await query(args);

            if (shouldCache({ model, action: action.operation, args, result })) {
              try {
                await redis.set(cacheKey, JSON.stringify(result), "EX", ttlSeconds);
              } catch (_error) {
                logger.warn(
                  `Failed to set cache key: ${cacheKey}, falling back to database`
                );
              }
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
              userId,
              key,
              invalidateKeys
            );
            try {
              await Promise.all(
                Array.from(keysToInvalidate).map((cacheKey) => redis.del(cacheKey))
              );
            } catch (error) {
              logger.warn(
                `Failed to invalidate some cache keys: ${error instanceof Error ? error.message : String(error)}`
              );
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

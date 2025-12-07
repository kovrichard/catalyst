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

class RedisCacheHandler {
  private readonly ttlSeconds: number;
  private readonly cacheActions: Partial<Record<string, CachedAction[]>>;
  private readonly globalActions: CachedAction[];
  private readonly key: (params: KeyParams) => string;
  private readonly shouldCache: (params: ShouldCacheParams) => boolean;
  private readonly invalidateOn: Partial<Record<string, MutatingAction[]>>;
  private readonly globalInvalidations: MutatingAction[];
  private readonly invalidateKeys: (
    params: InvalidateKeysParams
  ) => Iterable<string> | Promise<Iterable<string>>;

  constructor(config: CacheConfig) {
    this.ttlSeconds = config.ttlSeconds ?? 60;
    this.cacheActions = config.cacheActions ?? {};
    this.globalActions = config.globalActions ?? ["findUnique", "findFirst", "findMany"];
    this.key = config.key ?? defaultKey;
    this.shouldCache = config.shouldCache ?? (() => true);
    this.invalidateOn = config.invalidateOn ?? {};
    this.globalInvalidations = config.globalInvalidations ?? [
      "create",
      "update",
      "delete",
      "upsert",
      "createMany",
      "updateMany",
      "deleteMany",
    ];
    this.invalidateKeys = config.invalidateKeys ?? (({ cacheKeys }) => cacheKeys);
  }

  private getAction(operation: string): ActionResult {
    if (this.globalActions.includes(operation as CachedAction))
      return { type: "cached", operation: operation as CachedAction };
    if (this.globalInvalidations.includes(operation as MutatingAction))
      return { type: "mutating", operation: operation as MutatingAction };
    return { type: "unknown", operation: "unknown" };
  }

  private async getCachedValue(cacheKey: string): Promise<string | null> {
    if (!isRedisConnected(redis)) return null;

    try {
      return await redis.get(cacheKey);
    } catch (_error) {
      logger.warn(`Failed to get cache key: ${cacheKey}, falling back to database`);
      return null;
    }
  }

  private async parseCachedValue(cached: string, cacheKey: string): Promise<unknown> {
    try {
      return JSON.parse(cached);
    } catch (_error) {
      logger.warn(`Invalid cached data for key: ${cacheKey}, falling back to database`);
      if (isRedisConnected(redis)) {
        try {
          await redis.del(cacheKey);
        } catch (_error) {
          logger.warn(`Failed to delete invalid cache key: ${cacheKey}`);
        }
      }
      throw new Error("Invalid cached data");
    }
  }

  private async setCachedValue(cacheKey: string, value: unknown): Promise<void> {
    if (!isRedisConnected(redis)) return;
    try {
      await redis.set(cacheKey, JSON.stringify(value), "EX", this.ttlSeconds);
    } catch (_error) {
      logger.warn(`Failed to set cache key: ${cacheKey}, falling back to database`);
    }
  }

  private async invalidateCacheKeys(keys: Iterable<string>): Promise<void> {
    if (!isRedisConnected(redis)) return;
    const deleteResults = await Promise.allSettled(
      Array.from(keys).map((cacheKey) => redis.del(cacheKey))
    );
    const failedDeletions = deleteResults.filter(
      (result) => result.status === "rejected"
    );
    if (failedDeletions.length > 0) {
      logger.warn(
        `Failed to invalidate ${failedDeletions.length} of ${deleteResults.length} cache keys`
      );
    }
  }

  private async collectKeys(
    model: string,
    action: MutatingAction,
    args: unknown,
    userId: string | null
  ): Promise<Iterable<string>> {
    if (!isRedisConnected(redis)) return new Set<string>();

    // Extract prefix from key function by generating a sample key
    const sampleKey = this.key({
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

    return this.invalidateKeys({ model, action, args, cacheKeys });
  }

  async handleCachedAction(
    model: string,
    action: CachedAction,
    args: unknown,
    query: (args: unknown) => Promise<unknown>
  ): Promise<unknown> {
    const actionsForModel = this.cacheActions[model] ?? [];
    const shouldCacheAction =
      actionsForModel.includes(action) || this.globalActions.includes(action);

    if (!shouldCacheAction) return query(args);

    const cacheKey = this.key({ model, action, args });
    const cached = await this.getCachedValue(cacheKey);

    if (cached) {
      logger.debug(`Redis cache HIT for key: ${cacheKey}`);
      try {
        return await this.parseCachedValue(cached, cacheKey);
      } catch {
        // Fall through to query database
      }
    } else {
      logger.debug(`Redis cache MISS for key: ${cacheKey}`);
    }

    const result = await query(args);

    if (this.shouldCache({ model, action, args, result })) {
      await this.setCachedValue(cacheKey, result);
    }

    return result;
  }

  async handleMutatingAction(
    model: string,
    action: MutatingAction,
    args: unknown,
    userId: string | null,
    query: (args: unknown) => Promise<unknown>
  ): Promise<unknown> {
    const modelInvalidations = this.invalidateOn[model] ?? [];
    const shouldInvalidate =
      modelInvalidations.includes(action) || this.globalInvalidations.includes(action);

    if (!shouldInvalidate) return query(args);

    const result = await query(args);

    logger.debug(
      `INVALIDATE cache for model: ${model}, action: ${action}, userId: ${userId ?? "none"}, args: ${JSON.stringify(args)}`
    );

    const keysToInvalidate = await this.collectKeys(model, action, args, userId);
    await this.invalidateCacheKeys(keysToInvalidate);

    return result;
  }

  handleUnknownAction(
    query: (args: unknown) => Promise<unknown>,
    args: unknown
  ): Promise<unknown> {
    return query(args);
  }

  async handleOperation(
    model: string | undefined,
    operation: string,
    args: unknown,
    query: (args: unknown) => Promise<unknown>
  ): Promise<unknown> {
    if (!model) return query(args);

    if (!isRedisConnected(redis)) {
      logger.debug("Redis not configured, falling back to database");
      return query(args);
    }

    const userId = extractUserId(args);
    const action = this.getAction(operation);

    if (action.type === "cached") {
      return this.handleCachedAction(model, action.operation, args, query);
    } else if (action.type === "mutating") {
      return this.handleMutatingAction(model, action.operation, args, userId, query);
    } else {
      return this.handleUnknownAction(query, args);
    }
  }
}

export const withRedisCache = (config: CacheConfig) => {
  const handler = new RedisCacheHandler(config);

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
          return handler.handleOperation(model, operation, args, query);
        },
      } as never,
    })
  );
};

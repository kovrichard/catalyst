import "server-only";

import { Redis } from "ioredis";

import conf from "@/lib/config";
import { logger } from "@/lib/logger";

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!conf.redisConfigured) {
    return null;
  }

  if (!redis) {
    redis = new Redis({
      host: conf.redisHost,
      port: conf.redisPort,
      password: conf.redisPassword,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redis.on("error", (error) => {
      logger.error("Redis connection error:", error);
    });

    redis.on("connect", () => {
      logger.info("Redis connected successfully");
    });
  }

  return redis;
}

export const CacheKeys = {
  user: {
    byEmail: (email: string) => `user:email:${email}`,
    byId: (id: number) => `user:id:${id}`,
    session: (userId: number) => `user:session:${userId}`,
  },
  notification: {
    byUserId: (userId: number) => `notifications:user:${userId}`,
    byId: (id: number) => `notification:id:${id}`,
  },
} as const;

export const CacheTTL = {
  user: 300, // 5 minutes
  notification: 60, // 1 minute
  session: 1800, // 30 minutes
} as const;

export async function getCached<T>(
  key: string,
  fallback: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  const client = getRedisClient();

  if (!client) {
    logger.debug("Redis not configured, falling back to database");
    return fallback();
  }

  try {
    const cached = await client.get(key);
    if (cached) {
      logger.info(`Redis cache HIT for key: ${key}`);
      return JSON.parse(cached) as T;
    } else {
      logger.info(`Redis cache MISS for key: ${key}`);
    }
  } catch (error) {
    logger.error("Redis get error:", error);
  }

  const result = await fallback();

  await setCache(key, result, ttl);

  return result;
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = 300
): Promise<void> {
  const client = getRedisClient();

  if (!client) {
    logger.debug("Redis not configured, ignoring cache");
    return;
  }

  try {
    await client.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error("Redis set error:", error);
  }
}

export async function invalidateCache(keys: string[]): Promise<void> {
  const client = getRedisClient();

  if (!client) {
    logger.debug("Redis not configured, ignoring cache");
    return;
  }

  try {
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    logger.error("Redis delete error:", error);
  }
}

export async function invalidatePattern(pattern: string): Promise<void> {
  const client = getRedisClient();

  if (!client) {
    logger.debug("Redis not configured, ignoring cache");
    return;
  }

  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    logger.error("Redis pattern delete error:", error);
  }
}

// User-specific cache invalidation
export async function invalidateUserCache(userId: number, email?: string): Promise<void> {
  const keys = [CacheKeys.user.byId(userId), CacheKeys.user.session(userId)];

  if (email) {
    keys.push(CacheKeys.user.byEmail(email));
  }

  await invalidateCache(keys);
}

// Notification-specific cache invalidation
export async function invalidateNotificationCache(
  userId: number,
  notificationId?: number
): Promise<void> {
  const keys = [CacheKeys.notification.byUserId(userId)];

  if (notificationId) {
    keys.push(CacheKeys.notification.byId(notificationId));
  }

  await invalidateCache(keys);
}

// Health check
export async function isRedisHealthy(): Promise<boolean> {
  try {
    const client = getRedisClient();

    if (!client) {
      return false;
    }

    const result = await client.ping();
    return result === "PONG";
  } catch (error) {
    logger.error("Redis health check failed:", error);
    return false;
  }
}

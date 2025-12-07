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

export function isRedisConnected(redisClient: Redis | null): redisClient is Redis {
  logger.debug(`Redis status: '${redisClient?.status}'`);
  return (
    !!redisClient && (redisClient.status === "wait" || redisClient.status === "ready")
  );
}

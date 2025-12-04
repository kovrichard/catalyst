import "server-only";

import {
  CacheKeys,
  CacheTTL,
  getCached,
  invalidateNotificationCache,
  invalidateNotificationsCache,
} from "@/lib/cache/redis";
import {
  getNotifications,
  markMultipleNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/dao/notifications";
import { logger } from "@/lib/logger";
import type { Notification } from "@/lib/prisma/generated/client";
import { getUserFromSession } from "@/lib/services/user.service";
import { ensure } from "@/lib/utils";

export async function getUserNotifications(): Promise<Notification[]> {
  const user = await getUserFromSession();

  ensure(user.id, "User ID not found");

  try {
    return await getCached(
      CacheKeys.notification.byUserId(user.id),
      () => getNotifications(user.id),
      CacheTTL.notification
    );
  } catch (error) {
    const message = "Failed to get user notifications";
    logger.error(`${message}: ${error}`);

    throw new Error(message);
  }
}

export async function markAsRead(notificationId: number): Promise<void> {
  const user = await getUserFromSession();

  ensure(user.id, "User ID not found");

  try {
    await markNotificationAsRead(notificationId, user.id);

    await Promise.all([
      invalidateNotificationCache(user.id, notificationId),
      invalidateNotificationsCache(user.id),
    ]);
  } catch (error) {
    const message = "Failed to mark notification as read";
    logger.error(`${message}: ${error}`);

    throw new Error(message);
  }
}

export async function markMultipleAsRead(notificationIds: number[]): Promise<void> {
  const user = await getUserFromSession();

  ensure(user.id, "User ID not found");

  try {
    await markMultipleNotificationsAsRead(notificationIds, user.id);

    await invalidateNotificationsCache(user.id);
  } catch (error) {
    const message = "Failed to mark multiple notifications as read";
    logger.error(`${message}: ${error}`);

    throw new Error(message);
  }
}

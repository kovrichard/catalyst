import "server-only";

import {
  getNotifications,
  markMultipleNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/dao/notifications";
import type { Notification } from "@/lib/prisma/generated/client";
import { getUserFromSession } from "@/lib/services/user.service";

export async function getUserNotifications(): Promise<Notification[]> {
  const user = await getUserFromSession();

  return getNotifications(user.id);
}

export async function markAsRead(notificationId: string): Promise<void> {
  const user = await getUserFromSession();

  return markNotificationAsRead(notificationId, user.id);
}

export async function markMultipleAsRead(notificationIds: string[]): Promise<void> {
  const user = await getUserFromSession();

  return markMultipleNotificationsAsRead(notificationIds, user.id);
}

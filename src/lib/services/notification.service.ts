import "server-only";

import type { Notification } from "@prisma/client";
import {
  getNotifications,
  markMultipleNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/dao/notifications";
import { getUserFromSession } from "@/lib/dao/users";
import { ensure } from "@/lib/utils";

export async function getUserNotifications(): Promise<Notification[]> {
  const user = await getUserFromSession();

  ensure(user.id, "User ID not found");

  return getNotifications(user.id);
}

export async function markAsRead(notificationId: number): Promise<void> {
  const user = await getUserFromSession();

  ensure(user.id, "User ID not found");

  return markNotificationAsRead(notificationId, user.id);
}

export async function markMultipleAsRead(notificationIds: number[]): Promise<void> {
  const user = await getUserFromSession();

  ensure(user.id, "User ID not found");

  return markMultipleNotificationsAsRead(notificationIds, user.id);
}

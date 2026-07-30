"use server";

import "server-only";

import {
  markMultipleNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/dao/notifications";
import { getUserIdFromSession } from "@/lib/session";

export async function readNotification(notificationId: string): Promise<void> {
  const userId = await getUserIdFromSession();

  await markNotificationAsRead(notificationId, userId);
}

export async function readNotifications(notificationIds: string[]): Promise<void> {
  const userId = await getUserIdFromSession();

  await markMultipleNotificationsAsRead(notificationIds, userId);
}

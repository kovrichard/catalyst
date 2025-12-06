"use server";

import "server-only";

import { markAsRead, markMultipleAsRead } from "@/lib/services/notification.service";

export async function readNotification(notificationId: string): Promise<void> {
  await markAsRead(notificationId);
}

export async function readNotifications(notificationIds: string[]): Promise<void> {
  await markMultipleAsRead(notificationIds);
}

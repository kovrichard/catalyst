"use server";

import "server-only";

import { markAsRead, markMultipleAsRead } from "@/lib/services/notification.service";

export async function readNotification(notificationId: number): Promise<void> {
  await markAsRead(notificationId);
}

export async function readNotifications(notificationIds: number[]): Promise<void> {
  await markMultipleAsRead(notificationIds);
}

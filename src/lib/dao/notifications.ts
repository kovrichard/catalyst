import type { Notification } from "@/lib/prisma/generated/client";
import prisma from "@/lib/prisma/prisma";

export async function getNotifications(userId: number): Promise<Notification[]> {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function markNotificationAsRead(
  notificationId: number,
  userId: number
): Promise<void> {
  await prisma.notification.update({
    where: {
      id: notificationId,
      userId,
    },
    data: { read: true },
  });
}

export async function markMultipleNotificationsAsRead(
  notificationIds: number[],
  userId: number
): Promise<void> {
  await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId,
    },
    data: { read: true },
  });
}

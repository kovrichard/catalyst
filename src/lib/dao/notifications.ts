import type { Notification } from "@/lib/prisma/generated/client";
import prisma from "@/lib/prisma/prisma";

export async function getNotifications(userId: string): Promise<Notification[]> {
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
  notificationId: string,
  userId: string
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
  notificationIds: string[],
  userId: string
): Promise<void> {
  await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId,
    },
    data: { read: true },
  });
}

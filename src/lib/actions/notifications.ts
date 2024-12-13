"use server";

import "server-only";

import { getUserFromSession } from "@/lib/dao/users";
import prisma from "@/lib/prisma";

export async function readNotification(notificationId: number): Promise<void> {
  const user = await getUserFromSession();

  await prisma.notification.update({
    where: {
      id: notificationId,
      userId: user.id,
    },
    data: {
      read: true,
    },
  });
}

export async function readNotifications(notificationIds: number[]): Promise<void> {
  const user = await getUserFromSession();

  await prisma.notification.updateMany({
    where: {
      id: {
        in: notificationIds,
      },
      userId: user.id,
    },
    data: {
      read: true,
    },
  });
}

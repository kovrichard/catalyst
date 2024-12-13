import { getUserFromSession } from "@/lib/dao/users";
import prisma from "@/lib/prisma";

export async function getNotifications() {
  const user = await getUserFromSession();

  return prisma.notification.findMany({
    where: {
      userId: user.id,
    },
  });
}

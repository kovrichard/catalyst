import "server-only";

import type { User } from "@/lib/prisma/generated/client";
import prisma from "@/lib/prisma/prisma";

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

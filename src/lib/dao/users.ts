import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import type { User } from "@/lib/prisma/generated/client";
import prisma from "@/lib/prisma/prisma";

const unauthenticatedRedirect = "/login";

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export const getUserIdFromSession = cache(async (): Promise<string> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return redirect(unauthenticatedRedirect);
  }

  return session.user.id;
});

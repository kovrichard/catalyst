import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/dao/users";
import type { SessionUser } from "@/types/user";

const unauthenticatedRedirect = "/login";

export const getUserIdFromSession = cache(async (): Promise<string> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return redirect(unauthenticatedRedirect);
  }

  return session.user.id;
});

export const getUserFromSession = cache(async (): Promise<SessionUser> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect(unauthenticatedRedirect);
  }

  const user = await getUserByEmail(session.user?.email || "");

  if (!user) {
    return redirect(unauthenticatedRedirect);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    emailVerified: user.emailVerified,
  };
});

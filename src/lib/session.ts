import "server-only";

import { cacheLife } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import type { SessionUser } from "@/types/user";

const unauthenticatedRedirect = "/login";
const appShellMinStaleSeconds = 300;

async function fetchSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const { id, name, email, image, emailVerified } = session.user;
  return { id, name, email, image: image ?? null, emailVerified };
}

export const getOptionalUser = cache(fetchSessionUser);

export async function getUserFromSession(): Promise<SessionUser> {
  const user = await getOptionalUser();

  if (!user) {
    redirect(unauthenticatedRedirect);
  }

  return user;
}

export async function getUserIdFromSession(): Promise<string> {
  const { id } = await getUserFromSession();
  return id;
}

export async function getChromeUser(): Promise<SessionUser | null> {
  "use cache: private";
  cacheLife({ stale: appShellMinStaleSeconds });

  return fetchSessionUser();
}

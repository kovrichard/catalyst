import "server-only";

import type { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import { CacheKeys, CacheTTL, getCached, invalidateUserCache } from "@/lib/cache/redis";
import {
  createUser,
  deleteUserById,
  getUserByEmail,
  getUserById,
  updateUserById,
} from "@/lib/dao/users";
import { logger } from "@/lib/logger";
import { ensure } from "@/lib/utils";
import type { SessionUser } from "@/types/user";

const unauthenticatedRedirect = "/login";

export const getUser = cache(async (email: string): Promise<User | null> => {
  return getCached(
    CacheKeys.user.byEmail(email),
    () => getUserByEmail(email),
    CacheTTL.user
  );
});

export const getUserIdFromSession = cache(async (): Promise<number> => {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return redirect(unauthenticatedRedirect);
  }

  const userId = parseInt(session.user.id, 10);

  if (Number.isNaN(userId)) {
    logger.error(`Invalid user ID in session: ${session.user.id}`);
    return redirect(unauthenticatedRedirect);
  }

  return userId;
});

export const getUserFromSession = cache(async (): Promise<SessionUser> => {
  const session = await auth();

  if (!session) {
    return redirect(unauthenticatedRedirect);
  }

  const user = await getCached(
    CacheKeys.user.byEmail(session.user?.email || ""),
    () => getUserByEmail(session.user?.email || ""),
    CacheTTL.user
  );

  if (!user) {
    return redirect(unauthenticatedRedirect);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
  };
});

export async function saveUser(profile: {
  name: string;
  email: string;
  password?: string;
  picture: string;
}): Promise<User> {
  const user = await createUser(profile);

  await invalidateUserCache(user.id, user.email);

  return user;
}

export async function updateUser(
  userId: number,
  updates: Partial<Pick<User, "name" | "email" | "picture" | "password">>
): Promise<User> {
  try {
    const user = await updateUserById(userId, updates);

    await invalidateUserCache(userId, user.email);
    return user;
  } catch (error) {
    const message = "Failed to update user";
    logger.error(`${message}: ${error}`);

    throw new Error(message);
  }
}

export async function deleteUser(userId: number): Promise<void> {
  const user = await getUserById(userId);

  ensure(user, "User not found");

  try {
    await deleteUserById(userId);

    await invalidateUserCache(userId, user.email);
  } catch (error) {
    const message = "Failed to delete user";
    logger.error(`${message}: ${error}`);

    throw new Error(message);
  }
}

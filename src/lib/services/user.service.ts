import "server-only";

import type { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import { invalidateUserCache } from "@/lib/cache/redis";
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

export const getUserIdFromSession = cache(async (): Promise<number> => {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return redirect(unauthenticatedRedirect);
  }

  return parseInt(session.user.id, 10);
});

export const getUserFromSession = cache(async (): Promise<SessionUser> => {
  const session = await auth();

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

    await invalidateUserCache(userId);
  } catch (error) {
    const message = "Failed to delete user";
    logger.error(`${message}: ${error}`);

    throw new Error(message);
  }
}

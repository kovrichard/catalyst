import "server-only";

import type { User } from "@prisma/client";
import { invalidateUserCache } from "@/lib/cache/redis";
import { deleteUserById, getUserById, updateUserById } from "@/lib/dao/users";
import { logger } from "@/lib/logger";
import { ensure } from "@/lib/utils";

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

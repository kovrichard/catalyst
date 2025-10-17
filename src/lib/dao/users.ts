import "server-only";

import type { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma/prisma";

const unauthenticatedRedirect = "/login";

export async function getUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export const getUserIdFromSession = cache(async (): Promise<number> => {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return redirect(unauthenticatedRedirect);
  }

  return parseInt(session.user.id, 10);
});

export async function createUser(profile: {
  name: string;
  email: string;
  password?: string;
  picture: string;
}): Promise<User> {
  return prisma.user.create({
    data: {
      name: profile.name,
      email: profile.email,
      password: profile.password,
      picture: profile.picture,
    },
  });
}

export async function updateUserById(
  id: number,
  data: Partial<Pick<User, "name" | "email" | "picture" | "password">>
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUserById(id: number): Promise<User> {
  return prisma.user.delete({
    where: { id },
  });
}

import "server-only";

import { auth } from "@/auth";
import DBClient from "@/lib/prisma";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { cache } from "react";

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
}

export const getUserFromSession = cache(async (): Promise<Partial<User>> => {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email || "",
    },
  });

  if (!user) {
    return redirect("/login");
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
}) {
  const user = await prisma.user.create({
    data: {
      name: profile.name,
      email: profile.email,
      password: profile.password,
      picture: profile.picture,
    },
  });

  return user;
}

import "server-only";

import { auth } from "@/auth";
import DBClient from "@/lib/prisma";
import { redirect } from "next/navigation";

const prisma = DBClient.getInstance().prisma;

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
}

export async function getUserFromSession() {
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

  return user;
}

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

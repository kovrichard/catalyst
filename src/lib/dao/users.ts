"use server";

import { InvalidLoginError, auth, signIn } from "@/auth";
import DBClient from "@/lib/prisma";
import { redirect } from "next/navigation";

const prisma = DBClient.getInstance().prisma;

export async function signInUser(_prevState: any, formData: FormData) {
  const options = {
    email: formData.get("email"),
    password: formData.get("password"),
    callbackUrl: "/",
    redirect: false,
  };

  try {
    await signIn("credentials", options);

    return {
      message: "Signed in successfully",
      description: "You have been successfully signed in.",
    };
  } catch (error: any) {
    if (error.cause.err instanceof InvalidLoginError) {
      return {
        message: "Something went wrong",
        description: "Please try again.",
      };
    } else {
      return {
        message: "Failed to sign in",
        description: "Email or password is incorrect.",
      };
    }
  }
}

export async function registerUser(_prevState: any, formData: FormData) {
  const options = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    callbackUrl: "/",
    redirect: false,
    register: true,
  };

  try {
    await signIn("credentials", options);

    return {
      message: "Registered successfully",
      description: "You have been successfully registered.",
    };
  } catch (error: any) {
    if (error.cause.err instanceof InvalidLoginError) {
      return {
        message: "Something went wrong",
        description: "It's on us. Please try again.",
      };
    } else {
      return {
        message: "Registration failed",
        description: "User already exists.",
      };
    }
  }
}

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

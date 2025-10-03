"use server";

import "server-only";

import { InvalidLoginError, hashPassword, signIn, verifyPassword } from "@/auth";
import { getUserIdFromSession } from "@/lib/dao/users";
import prisma from "@/lib/prisma/prisma";
import { FormState } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function signInUser(
  _prevState: any,
  formData: FormData
): Promise<FormState> {
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
      success: true,
    };
  } catch (error: any) {
    if (error.cause.err instanceof InvalidLoginError) {
      return {
        message: "Something went wrong",
        description: "Please try again.",
        success: false,
      };
    } else {
      return {
        message: "Failed to sign in",
        description: "Email or password is incorrect.",
        success: false,
      };
    }
  }
}

export async function registerUser(
  _prevState: any,
  formData: FormData
): Promise<FormState> {
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
      success: true,
    };
  } catch (error: any) {
    if (error.cause.err instanceof InvalidLoginError) {
      return {
        message: "Something went wrong",
        description: "It's on us. Please try again.",
        success: false,
      };
    } else {
      return {
        message: "Registration failed",
        description: "User already exists.",
        success: false,
      };
    }
  }
}

export async function updateUserPassword(
  _prevState: any,
  formData: FormData
): Promise<FormState> {
  const userId = await getUserIdFromSession();
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    return {
      message: "User not found",
      description: "Please try again.",
      success: false,
    };
  }

  const currentPassword = formData.get("current-password") as string;
  const newPassword = formData.get("new-password") as string;
  const confirmPassword = formData.get("confirm-password") as string;

  if (user.password) {
    const passwordConfirmed = await verifyPassword(currentPassword, user.password);

    if (!passwordConfirmed) {
      return {
        message: "Invalid password",
        description: "Please try again.",
        success: false,
      };
    }
  }

  if (newPassword.length < 1 || confirmPassword.length < 1) {
    return {
      message: "Password too short",
      description: "Please try again.",
      success: false,
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      message: "Password mismatch",
      description: "Please try again.",
      success: false,
    };
  }

  const hashedPassword = hashPassword(newPassword);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  revalidatePath("/settings");

  return {
    message: "Password updated",
    description: "Your password has been updated.",
    success: true,
  };
}

export async function deleteUser(): Promise<FormState> {
  const userId = await getUserIdFromSession();

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return {
    message: "User deleted",
    description: "Your account has been deleted.",
    success: true,
  };
}

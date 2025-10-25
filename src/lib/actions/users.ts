"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { hashPassword, InvalidLoginError, signIn, verifyPassword } from "@/auth";
import { logger } from "@/lib/logger";
import prisma from "@/lib/prisma/prisma";
import {
  deleteUser,
  getUserIdFromSession,
  updateUser,
} from "@/lib/services/user.service";
import { turnstileFailedResponse, verifyTurnstile } from "@/lib/turnstile";
import type { FormState } from "@/lib/utils";
import {
  type LoginFormData,
  loginSchema,
  type RegisterFormData,
  registerSchema,
  type UpdatePasswordFormData,
  updatePasswordSchema,
} from "@/types/auth";

export async function signInUser(
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Need further investigation
  _prevState: any,
  formData: LoginFormData
): Promise<FormState> {
  const parsed = loginSchema.safeParse(formData);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      message: "Validation failed",
      description: firstError?.message ?? "Invalid input. Please check your data.",
      success: false,
    };
  }

  const parsedData = parsed.data;

  const turnstileResponse = parsedData["cf-turnstile-response"];
  const turnstileVerified = await verifyTurnstile(turnstileResponse);

  if (!turnstileVerified) {
    return turnstileFailedResponse;
  }

  const options = {
    email: parsedData.email,
    password: parsedData.password,
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
    // biome-ignore lint/suspicious/noExplicitAny: TODO: Need further investigation
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
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Need further investigation
  _prevState: any,
  formData: RegisterFormData
): Promise<FormState> {
  const parsed = registerSchema.safeParse(formData);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      message: "Validation failed",
      description: firstError?.message ?? "Invalid input. Please check your data.",
      success: false,
    };
  }

  const parsedData = parsed.data;

  const turnstileResponse = parsedData["cf-turnstile-response"];
  const turnstileVerified = await verifyTurnstile(turnstileResponse);

  if (!turnstileVerified) {
    return turnstileFailedResponse;
  }

  const options = {
    name: parsedData.name,
    email: parsedData.email,
    password: parsedData.password,
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
    // biome-ignore lint/suspicious/noExplicitAny: TODO: Need further investigation
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
        description: "Unable to complete registration. Please try again.",
        success: false,
      };
    }
  }
}

export async function updateUserPassword(
  // biome-ignore lint/suspicious/noExplicitAny: TODO: Need further investigation
  _prevState: any,
  formData: UpdatePasswordFormData
): Promise<FormState> {
  const parsed = updatePasswordSchema.safeParse(formData);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      message: "Validation failed",
      description: firstError?.message ?? "Invalid input. Please check your data.",
      success: false,
    };
  }

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

  const currentPassword = parsed.data.currentPassword?.trim() ?? "";
  const newPassword = parsed.data.newPassword.trim();

  if (user.password) {
    if (!currentPassword) {
      return {
        message: "Current password required",
        description: "Enter your current password to continue.",
        success: false,
      };
    }

    const passwordConfirmed = await verifyPassword(currentPassword, user.password);

    if (!passwordConfirmed) {
      return {
        message: "Invalid password",
        description: "Please try again.",
        success: false,
      };
    }
  }

  const hashedPassword = hashPassword(newPassword);

  await updateUser(userId, {
    password: hashedPassword,
  });

  revalidatePath("/settings");

  return {
    message: "Password updated",
    description: "Your password has been updated.",
    success: true,
  };
}

export async function deleteUserAction(): Promise<FormState> {
  const userId = await getUserIdFromSession();

  try {
    await deleteUser(userId);
  } catch (error) {
    const message = "Failed to delete user";
    logger.error(`${message}: ${error}`);

    return {
      message,
      description: "Please try again.",
      success: false,
    };
  }

  return {
    message: "User deleted",
    description: "Your account has been deleted.",
    success: true,
  };
}

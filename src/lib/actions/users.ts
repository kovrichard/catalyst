"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/auth";
import conf from "@/lib/config";
import { logger } from "@/lib/logger";
import prisma from "@/lib/prisma/prisma";
import publicConf from "@/lib/public-config";
import { getUserIdFromSession } from "@/lib/services/user.service";
import { turnstileFailedResponse, verifyTurnstile } from "@/lib/turnstile";
import type { FormState } from "@/lib/utils";
import {
  type LoginFormData,
  loginSchema,
  type RegisterFormData,
  registerSchema,
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

  const body = {
    email: parsedData.email,
    password: parsedData.password,
    callbackURL: publicConf.redirectPath,
  };

  try {
    await auth.api.signInEmail({ body });

    return {
      message: "Signed in successfully",
      description: "You have been successfully signed in.",
      success: true,
    };
    // biome-ignore lint/suspicious/noExplicitAny: TODO: Need further investigation
  } catch (error: any) {
    logger.error(error);
    return {
      message: "Failed to sign in",
      description: "Email or password is incorrect.",
      success: false,
    };
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

  const body = {
    name: parsedData.name,
    email: parsedData.email,
    password: parsedData.password,
    callbackURL: publicConf.redirectPath,
  };

  try {
    await auth.api.signUpEmail({ body });

    return {
      message: "Registered successfully",
      description: "You have been successfully registered.",
      success: true,
    };
    // biome-ignore lint/suspicious/noExplicitAny: TODO: Need further investigation
  } catch (error: any) {
    logger.error(error);
    return {
      message: "Registration failed",
      description: "Unable to complete registration. Please try again.",
      success: false,
    };
  }
}

export async function setUserPassword(password: string): Promise<FormState> {
  const sessionHeaders = await headers();
  try {
    await auth.api.setPassword({
      body: {
        newPassword: password,
      },
      headers: sessionHeaders,
    });
  } catch (e) {
    logger.error(e);

    return {
      message: "Failed to set password",
      description: "Something went wrong. Please try again.",
      success: false,
    };
  }

  revalidatePath("/settings");

  return {
    message: "Password set successfully",
    description: "You can now sign in with your email and password.",
    success: true,
  };
}

export async function requestPasswordReset(email: string): Promise<FormState> {
  try {
    const response = await auth.api.requestPasswordReset({
      body: { email, redirectTo: `${conf.host}/reset-password` },
    });

    return {
      message: "Password reset email sent",
      description:
        response.message ||
        "If an account exists with this email, you will receive a password reset link.",
      success: true,
    };
  } catch (e) {
    logger.error(e);
    return {
      message: "Failed to request password reset",
      description: "Something went wrong. Please try again.",
      success: false,
    };
  }
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

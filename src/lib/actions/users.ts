"use server";

import "server-only";

import { InvalidLoginError, signIn } from "@/auth";

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

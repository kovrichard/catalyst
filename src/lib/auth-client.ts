"use client";

import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession, changePassword, resetPassword } =
  createAuthClient();

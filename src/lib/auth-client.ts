"use client";

import { createAuthClient } from "better-auth/react";

export const { signIn, signOut, changePassword, resetPassword } = createAuthClient();

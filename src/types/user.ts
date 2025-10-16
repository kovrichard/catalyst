import type { User } from "@prisma/client";

export type SessionUser = Omit<
  User,
  "password" | "notifications" | "createdAt" | "updatedAt"
>;

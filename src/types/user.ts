import type { User } from "@/lib/prisma/generated/client";

export type SessionUser = Omit<
  User,
  "password" | "notifications" | "createdAt" | "updatedAt"
>;

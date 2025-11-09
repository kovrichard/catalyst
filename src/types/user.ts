import type { User } from "@/lib/prisma/client";

export type SessionUser = Omit<
  User,
  "password" | "notifications" | "createdAt" | "updatedAt"
>;

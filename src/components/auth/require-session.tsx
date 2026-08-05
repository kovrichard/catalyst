import { getUserFromSession } from "@/lib/session";

export async function RequireSession() {
  await getUserFromSession();

  return null;
}

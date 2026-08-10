import { getUserFromSession } from "@/lib/session";

export async function SessionGate() {
  await getUserFromSession();
  return null;
}

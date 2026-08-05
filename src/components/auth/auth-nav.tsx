import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export async function AuthNav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return (
      <Button asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    );
  }

  return (
    <>
      <Link href="/login">Login</Link>
      <Button asChild>
        <Link href="/register">Register</Link>
      </Button>
    </>
  );
}

export function AuthNavSkeleton() {
  return <Skeleton className="h-9 w-36 rounded-md" />;
}

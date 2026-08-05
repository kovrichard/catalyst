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
      <Link href="/dashboard">
        <Button>Dashboard</Button>
      </Link>
    );
  }

  return (
    <>
      <Link href="/login">Login</Link>
      <Link href="/register">
        <Button>Register</Button>
      </Link>
    </>
  );
}

export function AuthNavSkeleton() {
  return <Skeleton className="h-9 w-36 rounded-md" />;
}

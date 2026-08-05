import Link from "next/link";
import { Suspense } from "react";
import { PasswordResetFormSkeleton } from "@/components/auth/password-form-skeleton";
import PasswordResetForm from "@/components/auth/password-reset-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default function Page({ searchParams }: Readonly<{ searchParams: SearchParams }>) {
  return (
    <main className="m-auto">
      <Card className="w-92">
        <CardHeader className="text-center">
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<PasswordResetFormSkeleton />}>
            <TokenBoundForm searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}

async function TokenBoundForm({
  searchParams,
}: Readonly<{ searchParams: SearchParams }>) {
  const { token } = await searchParams;

  if (typeof token !== "string" || token.length === 0) {
    return <InvalidResetLink />;
  }

  return <PasswordResetForm token={token} />;
}

function InvalidResetLink() {
  return (
    <p className="text-center text-muted-foreground text-sm">
      This reset link is invalid or incomplete.{" "}
      <Link href="/reset-password/request" className="underline">
        Request a new one
      </Link>
      .
    </p>
  );
}

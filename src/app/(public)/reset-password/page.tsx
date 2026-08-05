import { Suspense } from "react";
import { PasswordFormSkeleton } from "@/components/auth/password-form-skeleton";
import PasswordResetForm from "@/components/auth/password-reset-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SearchParams = Promise<{ token: string }>;

export default function Page({ searchParams }: Readonly<{ searchParams: SearchParams }>) {
  return (
    <main className="m-auto">
      <Card className="w-92">
        <CardHeader className="text-center">
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<PasswordFormSkeleton />}>
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

  return <PasswordResetForm token={token} />;
}

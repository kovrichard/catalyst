import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AuthCard from "@/components/auth/auth-card";
import { PasswordResetFormSkeleton } from "@/components/auth/password-form-skeleton";
import PasswordResetForm from "@/components/auth/password-reset-form";
import { openGraph } from "@/lib/metadata";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const path = "/reset-password";
const title = "Reset your password | Catalyst";
const description =
  "Choose a new password for your Catalyst account using your reset link.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  alternates: {
    canonical: path,
  },
  openGraph: {
    ...openGraph,
    title,
    description,
    url: path,
  },
};

export default function Page({ searchParams }: Readonly<{ searchParams: SearchParams }>) {
  return (
    <main className="m-auto w-full px-4 py-8">
      <AuthCard
        title="Choose a new password"
        description="Pick something you have not used here before."
        showOAuth={false}
      >
        <Suspense fallback={<PasswordResetFormSkeleton />}>
          <TokenBoundForm searchParams={searchParams} />
        </Suspense>
      </AuthCard>
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
      This link is not valid any more.{" "}
      <Link href="/reset-password/request" className="underline underline-offset-4">
        Ask for a new one
      </Link>
      .
    </p>
  );
}

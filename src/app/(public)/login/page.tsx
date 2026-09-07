import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import AuthCard from "@/components/auth/auth-card";
import { LoginCardSkeleton } from "@/components/auth/auth-card-skeleton";
import LoginForm from "@/components/auth/login-form";
import { openGraph } from "@/lib/metadata";

const path = "/login";
const title = "Log in | Catalyst";
const description = "Sign in to your Catalyst account to pick up where you left off.";

export const metadata: Metadata = {
  title,
  description,
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

export default function Login() {
  return (
    <main className="m-auto w-full px-4 py-8">
      <Suspense fallback={<LoginCardSkeleton />}>
        <RuntimeAuthCard />
      </Suspense>
    </main>
  );
}

// The OAuth and Turnstile blocks are gated on env vars the image build does not
// receive, so a prerendered shell would omit markup the running container renders.
async function RuntimeAuthCard() {
  await connection();

  return (
    <AuthCard
      title="Sign in to Catalyst"
      ctaQuestion="First time here?"
      ctaText="Sign up"
      ctaLink="/register"
      showPasskey
    >
      <LoginForm />
    </AuthCard>
  );
}

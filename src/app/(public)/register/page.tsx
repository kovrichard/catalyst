import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import AuthCard from "@/components/auth/auth-card";
import { RegisterCardSkeleton } from "@/components/auth/auth-card-skeleton";
import RegisterForm from "@/components/auth/register-form";
import { openGraph } from "@/lib/metadata";

const path = "/register";
const title = "Sign up | Catalyst";
const description =
  "Create a Catalyst account and start building with the agentic Next.js boilerplate.";

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

export default function Register() {
  return (
    <main className="m-auto w-full px-4 py-8">
      <Suspense fallback={<RegisterCardSkeleton />}>
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
      title="Create your account"
      description="It takes about a minute."
      ctaQuestion="Already have an account?"
      ctaText="Log in"
      ctaLink="/login"
    >
      <RegisterForm />
    </AuthCard>
  );
}

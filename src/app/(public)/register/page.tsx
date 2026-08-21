import type { Metadata } from "next";
import AuthCard from "@/components/auth/auth-card";
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

export default function Login() {
  return (
    <main className="m-auto w-full px-4 py-8">
      <AuthCard
        title="Create your account"
        description="It takes about a minute."
        ctaQuestion="Already have an account?"
        ctaText="Log in"
        ctaLink="/login"
      >
        <RegisterForm />
      </AuthCard>
    </main>
  );
}

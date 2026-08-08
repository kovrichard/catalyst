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
    <main className="m-auto">
      <AuthCard
        title="Let's get started!"
        description="Create an account to continue"
        ctaQuestion="Already have an account?"
        ctaText="Login"
        ctaLink="/login"
      >
        <RegisterForm />
      </AuthCard>
    </main>
  );
}

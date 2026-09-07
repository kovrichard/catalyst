import type { Metadata } from "next";
import AuthCard from "@/components/auth/auth-card";
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
      <AuthCard
        title="Sign in to Catalyst"
        ctaQuestion="First time here?"
        ctaText="Sign up"
        ctaLink="/register"
        showPasskey
      >
        <LoginForm />
      </AuthCard>
    </main>
  );
}

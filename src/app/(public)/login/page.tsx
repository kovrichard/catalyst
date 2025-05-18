import AuthCard from "@/components/auth/auth-card";
import LoginForm from "@/components/auth/login-form";
import { canonicalUrl, openGraph } from "@/lib/metadata";
import { Metadata } from "next";

const path = "/login";

export const metadata: Metadata = {
  alternates: {
    canonical: `${canonicalUrl}${path}`,
  },
  openGraph: {
    ...openGraph,
    url: path,
  },
};

export default function Login() {
  return (
    <main className="m-auto">
      <AuthCard
        title="Welcome back!"
        description="Sign in to your account to continue"
        ctaQuestion="First time here?"
        ctaText="Sign up"
        ctaLink="/register"
      >
        <LoginForm />
      </AuthCard>
    </main>
  );
}

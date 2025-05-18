import AuthCard from "@/components/auth/auth-card";
import RegisterForm from "@/components/auth/register-form";
import { canonicalUrl, openGraph } from "@/lib/metadata";
import { Metadata } from "next";

const path = "/register";

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

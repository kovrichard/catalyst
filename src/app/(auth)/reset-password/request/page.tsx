import type { Metadata } from "next";
import AuthCard from "@/components/auth/auth-card";
import RequestPasswordResetForm from "@/components/auth/request-password-reset-form";
import { openGraph } from "@/lib/metadata";

const path = "/reset-password/request";
const title = "Forgot your password? | Catalyst";
const description = "Request a password reset link for your Catalyst account.";

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

export default async function Page() {
  return (
    <main className="m-auto w-full px-4 py-8">
      <AuthCard
        title="Forgot your password?"
        description="We will email you a link to set a new one."
        showOAuth={false}
      >
        <RequestPasswordResetForm />
      </AuthCard>
    </main>
  );
}

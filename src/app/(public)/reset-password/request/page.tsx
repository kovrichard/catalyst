import type { Metadata } from "next";
import RequestPasswordResetForm from "@/components/auth/request-password-reset-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { openGraph } from "@/lib/metadata";

const path = "/reset-password/request";
const title = "Forgot your password? | Catalyst";
const description = "Request a password reset link for your Catalyst account.";

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

export default async function Page() {
  return (
    <main className="m-auto">
      <Card className="w-92">
        <CardHeader className="text-center">
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your email to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <RequestPasswordResetForm />
        </CardContent>
      </Card>
    </main>
  );
}

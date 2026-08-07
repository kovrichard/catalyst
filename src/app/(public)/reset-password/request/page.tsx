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

export const metadata: Metadata = {
  alternates: {
    canonical: path,
  },
  openGraph: {
    ...openGraph,
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

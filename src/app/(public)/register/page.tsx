import OAuthForm from "@/components/auth/oauth-form";
import RegisterForm from "@/components/auth/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import conf from "@/lib/config";
import { canonicalUrl, openGraph } from "@/lib/metadata";
import { Metadata } from "next";
import Link from "next/link";

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
  const hasGitHub = Boolean(conf.githubId) && Boolean(conf.githubSecret);
  const hasGoogle = Boolean(conf.googleId) && Boolean(conf.googleSecret);

  return (
    <main className="m-auto">
      <Card className="w-80">
        <CardHeader className="text-center">
          <CardTitle>Let's get started!</CardTitle>
          <CardDescription>Create an account to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <RegisterForm />
          {(hasGitHub || hasGoogle) && (
            <p className="mx-auto text-sm text-muted-foreground">or continue with</p>
          )}
          {hasGoogle && <OAuthForm provider="google" />}
          {hasGitHub && <OAuthForm provider="github" />}
          <p className="mx-auto">
            <span className="text-muted-foreground">Already have an account?</span>{" "}
            <Link href="/login" className="font-semibold">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

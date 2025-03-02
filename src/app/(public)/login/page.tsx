import LoginForm from "@/components/login-form";
import OAuthForm from "@/components/oauth-form";
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
  const hasGitHub = Boolean(conf.githubId) && Boolean(conf.githubSecret);
  const hasGoogle = Boolean(conf.googleId) && Boolean(conf.googleSecret);

  return (
    <main className="m-auto">
      <Card className="w-80">
        <CardHeader className="text-center">
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LoginForm />
          {(hasGitHub || hasGoogle) && (
            <p className="mx-auto text-sm text-muted-foreground">or continue with</p>
          )}
          {hasGoogle && <OAuthForm provider="google" />}
          {hasGitHub && <OAuthForm provider="github" />}
          <p className="mx-auto">
            <span className="text-muted-foreground">First time here?</span>{" "}
            <Link href="/register" className="font-semibold">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

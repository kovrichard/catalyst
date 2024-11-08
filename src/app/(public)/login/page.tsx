import LoginForm from "@/components/login-form";
import OAuthForm from "@/components/oauth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: {
    canonical: "/login",
  },
};

export default function Login() {
  const hasGitHub =
    Boolean(process.env.AUTH_GITHUB_ID) && Boolean(process.env.AUTH_GITHUB_SECRET);
  const hasGoogle =
    Boolean(process.env.AUTH_GOOGLE_ID) && Boolean(process.env.AUTH_GOOGLE_SECRET);

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

import OAuthForm from "@/components/oauth-form";
import RegisterForm from "@/components/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Login() {
  const hasGitHub =
    Boolean(process.env.AUTH_GITHUB_ID) && Boolean(process.env.AUTH_GITHUB_SECRET);
  const hasGoogle =
    Boolean(process.env.AUTH_GOOGLE_ID) && Boolean(process.env.AUTH_GOOGLE_SECRET);

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

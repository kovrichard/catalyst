import GoogleForm from "@/components/google-form";
import LoginForm from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Login() {
  return (
    <main className="m-auto">
      <Card className="w-80">
        <CardHeader className="text-center">
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LoginForm />
          <p className="mx-auto text-sm text-muted-foreground">or continue with</p>
          <GoogleForm />
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

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
    <main className="flex flex-1 m-auto flex-col items-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>Sign in to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <LoginForm />
          <p className="mx-auto">or</p>
          <GoogleForm buttonText="Sign in with Google" />
          <p className="mx-auto">
            First time here? <Link href="/register">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

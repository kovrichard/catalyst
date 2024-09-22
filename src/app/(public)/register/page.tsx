import GoogleForm from "@/components/google-form";
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
  return (
    <main className="flex flex-1 m-auto flex-col items-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Let's get started!</CardTitle>
          <CardDescription>Create an account to continue.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <RegisterForm />
          <p className="mx-auto">or</p>
          <GoogleForm buttonText="Sign up with Google" />
          <p className="mx-auto">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

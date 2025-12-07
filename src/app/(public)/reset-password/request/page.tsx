import RequestPasswordResetForm from "@/components/auth/request-password-reset-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Page() {
  return (
    <main className="m-auto">
      <Card>
        <CardHeader>
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

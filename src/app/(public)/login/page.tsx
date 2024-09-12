import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function Login() {
  return (
    <main className="flex flex-1 m-auto flex-col items-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>Sign in to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex justify-center"
            action={async () => {
              "use server";

              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <Button type="submit" className="flex gap-2">
              <Image
                src="/google.svg"
                width="20"
                height="20"
                alt="Google"
                className="pointer-events-none"
              />
              <span className="pointer-events-none">Sign in with Google</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToast from "@/hooks/use-toast";
import { signInUser } from "@/lib/actions/users";
import { FormState, initialState } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction] = useActionState(signInUser, initialState);
  const router = useRouter();

  const toastCallback = (state: FormState) => {
    if (state.message === "Signed in successfully") {
      router.push(String(process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL));
    }
  };

  useToast(state, toastCallback);

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <Label htmlFor="email" className="space-y-1">
        <span>Email</span>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="johndoe@example.com"
          required
          autoFocus
        />
      </Label>
      <Label htmlFor="password" className="space-y-1">
        <span>Password</span>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="****************"
          required
        />
      </Label>
      <Button type="submit" className="mt-[18px]">
        Sign in
      </Button>
    </form>
  );
}

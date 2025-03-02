"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToast from "@/hooks/use-toast";
import { signInUser } from "@/lib/actions/users";
import publicConf from "@/lib/public-config";
import { FormState, initialState } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import PendingSubmitButton from "./pending-submit-button";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInUser, initialState);
  const router = useRouter();

  const toastCallback = (state: FormState) => {
    if (state.message === "Signed in successfully") {
      router.push(publicConf.redirectPath);
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
      <PendingSubmitButton isPending={isPending} text="Sign in" className="mt-[18px]" />
    </form>
  );
}

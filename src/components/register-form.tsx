"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToast from "@/hooks/use-toast";
import { registerUser } from "@/lib/actions/users";
import publicConf from "@/lib/public-config";
import { FormState, initialState } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import PendingSubmitButton from "./pending-submit-button";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  const router = useRouter();

  const toastCallback = (state: FormState) => {
    if (state.message === "Registered successfully") {
      router.push(publicConf.redirectPath);
    }
  };

  useToast(state, toastCallback);

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <Label htmlFor="name" className="space-y-1">
        <span>Name</span>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="John Doe"
          required
          autoFocus
        />
      </Label>
      <Label htmlFor="email" className="space-y-1">
        <span>Email</span>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="johndoe@example.com"
          required
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
      <PendingSubmitButton isPending={isPending} text="Sign up" className="mt-[18px]" />
    </form>
  );
}

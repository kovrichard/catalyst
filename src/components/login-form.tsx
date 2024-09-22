"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInUser } from "@/lib/dao/users";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

const initialState = {
  message: "",
  description: "",
};

export default function LoginForm() {
  const [state, formAction] = useFormState(signInUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (!state.message) return;

    toast(state.message, {
      description: state.description,
      action: {
        label: "OK",
        onClick: () => {
          toast.dismiss();
        },
      },
    });

    if (state.message === "Signed in successfully") {
      router.push(process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL as string);
    }
  }, [state]);

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

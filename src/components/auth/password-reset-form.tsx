"use client";

import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth-client";

export default function PasswordResetForm({ token }: { token: string }) {
  const passwordId = useId();
  const confirmPasswordId = useId();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsPending(true);
    try {
      await resetPassword(
        { newPassword: password, token },
        {
          onSuccess: () => {
            toast.success("Password reset successfully");
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to reset password");
          },
        }
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor={passwordId}>New Password</Label>
        <Input
          type="password"
          id={passwordId}
          name="password"
          placeholder="****************"
          autoComplete="new-password"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={confirmPasswordId}>Confirm Password</Label>
        <Input
          type="password"
          id={confirmPasswordId}
          name="confirm-password"
          placeholder="****************"
          autoComplete="new-password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        Reset Password
      </Button>
    </form>
  );
}

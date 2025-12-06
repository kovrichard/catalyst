"use client";

import Link from "next/link";
import { type FormEvent, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/actions/users";

export default function RequestPasswordResetForm() {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;

    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (result.success) {
        toast.success(result.message, {
          description: result.description,
        });
      } else {
        toast.error(result.message, {
          description: result.description,
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="johndoe@example.com"
          required
          autoFocus
        />
      </div>
      <Button type="submit" className="mt-2 w-full" disabled={isPending}>
        Send Reset Link
      </Button>
      <div className="text-center">
        <Link
          href="/login"
          className="text-muted-foreground text-sm transition-colors hover:text-primary"
        >
          Back to Login
        </Link>
      </div>
    </form>
  );
}

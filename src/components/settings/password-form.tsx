"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToast from "@/hooks/use-toast";
import { updateUserPassword } from "@/lib/actions/users";
import { initialState } from "@/lib/utils";
import { type UpdatePasswordFormData, updatePasswordSchema } from "@/types/auth";

export default function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, formAction, isPending] = useActionState(updateUserPassword, initialState);
  const [isTransitionPending, startTransition] = useTransition();

  const schema = useMemo(() => {
    if (!hasPassword) {
      return updatePasswordSchema;
    }
    return updatePasswordSchema.refine(
      (data) => {
        return (
          data.currentPassword !== undefined && data.currentPassword.trim().length > 0
        );
      },
      {
        message: "Current password is required",
        path: ["currentPassword"],
      }
    );
  }, [hasPassword]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useToast(state);

  useEffect(() => {
    if (state.success) {
      reset();
    }
  }, [state.success, reset]);

  const onSubmit = (data: UpdatePasswordFormData) => {
    startTransition(() => {
      formAction(data);
    });
  };

  const isLoading = isPending || isSubmitting || isTransitionPending;

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      {hasPassword && (
        <div>
          <Label htmlFor="current-password">Current Password</Label>
          <Input type="password" id="current-password" {...register("currentPassword")} />
          {errors.currentPassword && (
            <span className="text-xs text-destructive">
              {errors.currentPassword.message}
            </span>
          )}
        </div>
      )}
      <div>
        <Label htmlFor="new-password">New Password</Label>
        <Input type="password" id="new-password" {...register("newPassword")} />
        {errors.newPassword && (
          <span className="text-xs text-destructive">{errors.newPassword.message}</span>
        )}
      </div>
      <div>
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input type="password" id="confirm-password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <span className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>
      <Button type="submit" className="mt-4 w-fit" disabled={isLoading}>
        Save
      </Button>
    </form>
  );
}

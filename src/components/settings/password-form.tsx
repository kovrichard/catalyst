"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUserPassword } from "@/lib/actions/users";
import { changePassword } from "@/lib/auth-client";
import { type UpdatePasswordFormData, updatePasswordSchema } from "@/types/auth";

export default function PasswordForm({ hasPassword }: { hasPassword?: boolean }) {
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();
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

  const onSubmit = (data: UpdatePasswordFormData) => {
    startTransition(async () => {
      if (hasPassword) {
        await changePassword(
          {
            currentPassword: data.currentPassword ?? "",
            newPassword: data.newPassword,
            revokeOtherSessions: true,
          },
          {
            onSuccess: () => {
              toast.success("Password updated");
              reset();
            },
            onError: (error) => {
              toast.error(error.error.message);
            },
          }
        );
      } else {
        const result = await setUserPassword(data.newPassword);
        if (result.success) {
          toast.success(result.message);
          reset();
        } else {
          toast.error(result.message);
        }
      }
    });
  };

  const isLoading = isSubmitting || isTransitionPending;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {hasPassword && (
        <div className="flex flex-col gap-2">
          <Label htmlFor={currentPasswordId}>Current Password</Label>
          <Input
            type="password"
            id={currentPasswordId}
            autoComplete="current-password"
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <span className="text-destructive text-xs">
              {errors.currentPassword.message}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Label htmlFor={newPasswordId}>New Password</Label>
        <Input
          type="password"
          id={newPasswordId}
          autoComplete="new-password"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <span className="text-destructive text-xs">{errors.newPassword.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={confirmPasswordId}>Confirm Password</Label>
        <Input
          type="password"
          id={confirmPasswordId}
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <span className="text-destructive text-xs">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>
      <Button type="submit" className="w-fit" disabled={isLoading}>
        Save
      </Button>
    </form>
  );
}

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

/**
 * Renders a password update form for the user.
 *
 * The form includes fields for new password and confirmation, and—when `hasPassword` is true—an additional required current password field. Validation is applied via the component's schema, submission triggers the update action, and the submit button is disabled while the update is in progress.
 *
 * @param hasPassword - Whether the user already has a password; when true, the current password field is shown and required.
 * @returns A React form element for updating the user's password.
 */
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
            <span className="text-destructive text-xs">
              {errors.currentPassword.message}
            </span>
          )}
        </div>
      )}
      <div>
        <Label htmlFor="new-password">New Password</Label>
        <Input type="password" id="new-password" {...register("newPassword")} />
        {errors.newPassword && (
          <span className="text-destructive text-xs">{errors.newPassword.message}</span>
        )}
      </div>
      <div>
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input type="password" id="confirm-password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <span className="text-destructive text-xs">
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
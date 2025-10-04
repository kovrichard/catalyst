"use client";

import { useRouter } from "next/navigation";
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import PendingSubmitButton from "@/components/auth/pending-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToast from "@/hooks/use-toast";
import { registerUser } from "@/lib/actions/users";
import publicConf from "@/lib/public-config";
import { type FormState, initialState } from "@/lib/utils";
import type { RegisterFormData } from "@/types/auth";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  const [isTransitionPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const toastCallback = (state: FormState) => {
    if (state.success) {
      localStorage.setItem("catalyst-auth-method", "password");
      router.push(publicConf.redirectPath);
    }
  };

  useToast(state, toastCallback);

  const onSubmit = async (data: RegisterFormData) => {
    startTransition(() => {
      formAction(data);
    });
  };

  const isLoading = isPending || isSubmitting || isTransitionPending;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="name" className="flex flex-col gap-1">
        <span>Name</span>
        <Input
          type="text"
          id="name"
          placeholder="John Doe"
          autoFocus
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
        />
        {errors.name && (
          <span className="text-xs text-destructive">{errors.name.message}</span>
        )}
      </Label>
      <Label htmlFor="email" className="flex flex-col gap-1">
        <span>Email</span>
        <Input
          type="email"
          id="email"
          placeholder="johndoe@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <span className="text-xs text-destructive">{errors.email.message}</span>
        )}
      </Label>
      <Label htmlFor="password" className="flex flex-col gap-1">
        <span>Password</span>
        <Input
          type="password"
          id="password"
          placeholder="****************"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            validate: {
              hasUpperCase: (value) => /[A-Z]/.test(value) || "Add an uppercase letter",
              hasLowerCase: (value) => /[a-z]/.test(value) || "Add a lowercase letter",
              hasNumber: (value) => /[0-9]/.test(value) || "Add a number",
              hasSpecialChar: (value) =>
                /[!@#$%^&*(),.?":{}|<>+\-=_~`[\]\\;'/]/.test(value) ||
                "Add a special character",
            },
          })}
        />
        {errors.password && (
          <span className="text-xs text-destructive">{errors.password.message}</span>
        )}
      </Label>
      <PendingSubmitButton isPending={isLoading} text="Sign up" className="mt-[18px]" />
    </form>
  );
}

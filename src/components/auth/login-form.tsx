"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import PendingSubmitButton from "@/components/auth/pending-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToast from "@/hooks/use-toast";
import { signInUser } from "@/lib/actions/users";
import publicConf from "@/lib/public-config";
import { type FormState, initialState } from "@/lib/utils";
import { type LoginFormData, loginSchema } from "@/types/auth";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInUser, initialState);
  const [isTransitionPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      "cf-turnstile-response": "",
    },
  });

  const toastCallback = (state: FormState) => {
    if (state.success) {
      localStorage.setItem("catalyst-auth-method", "password");
      router.push(publicConf.redirectPath);
    }
  };

  useToast(state, toastCallback);

  const onSubmit = async (data: LoginFormData) => {
    startTransition(() => {
      formAction(data);
    });
  };

  const isLoading = isPending || isSubmitting || isTransitionPending;

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor="email" className="flex flex-col gap-1">
        <span>Email</span>
        <Input
          type="email"
          id="email"
          placeholder="johndoe@example.com"
          autoFocus
          {...register("email")}
        />
        {errors.email && (
          <span className="text-destructive text-xs">{errors.email.message}</span>
        )}
      </Label>
      <Label htmlFor="password" className="flex flex-col gap-1">
        <span>Password</span>
        <Input
          type="password"
          id="password"
          placeholder="****************"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-destructive text-xs">{errors.password.message}</span>
        )}
      </Label>
      {publicConf.turnstileSiteKey && (
        <Turnstile
          className="mx-auto"
          siteKey={publicConf.turnstileSiteKey}
          onSuccess={(token: string) => {
            setValue("cf-turnstile-response", token);
          }}
        />
      )}
      <PendingSubmitButton isPending={isLoading} text="Sign in" />
    </form>
  );
}

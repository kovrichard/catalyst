"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import PendingSubmitButton from "@/components/auth/pending-submit-button";
import TurnstileComponent from "@/components/auth/turnstile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToast from "@/hooks/use-toast";
import { signInUser } from "@/lib/actions/users";
import { usePublicConfig } from "@/lib/contexts/public-config-context";
import { type FormState, initialState } from "@/lib/utils";
import { type LoginFormData, loginSchema } from "@/types/auth";

export default function LoginForm() {
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [state, formAction, isPending] = useActionState(signInUser, initialState);
  const [isTransitionPending, startTransition] = useTransition();
  const router = useRouter();
  const publicConf = usePublicConfig();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      "cf-turnstile-response": "",
    },
  });

  const turnstileEnabled = Boolean(publicConf.turnstileSiteKey);
  const [revealTurnstile, setRevealTurnstile] = useState(false);
  const email = watch("email");
  const password = watch("password");
  const hasToken = Boolean(watch("cf-turnstile-response"));

  useEffect(() => {
    if (turnstileEnabled && !revealTurnstile && email?.trim() && password?.trim()) {
      setRevealTurnstile(true);
    }
  }, [turnstileEnabled, revealTurnstile, email, password]);

  const toastCallback = (state: FormState) => {
    if (state.success) {
      localStorage.setItem("catalyst-auth-method", "password");
      router.push(publicConf.redirectPath);
    } else {
      setValue("cf-turnstile-response", "");
      turnstileRef.current?.reset();
    }
  };

  useToast(state, toastCallback);

  async function onSubmit(data: LoginFormData) {
    startTransition(() => {
      formAction(data);
    });
  }

  function setTurnstileValue(token: string) {
    setValue("cf-turnstile-response", token);
  }

  const isLoading = isPending || isSubmitting || isTransitionPending;

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="johndoe@example.com"
          autoComplete="email"
          autoFocus
          {...register("email")}
        />
        {errors.email && (
          <span className="text-destructive text-xs">{errors.email.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/reset-password/request"
            className="text-primary text-xs underline-offset-4 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          id="password"
          placeholder="****************"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-destructive text-xs">{errors.password.message}</span>
        )}
      </div>
      <div className="flex flex-col">
        <TurnstileComponent
          turnstileRef={turnstileRef}
          setValue={setTurnstileValue}
          show={revealTurnstile}
        />
        <PendingSubmitButton
          isPending={isLoading}
          text="Sign in"
          className="w-full"
          disabled={turnstileEnabled && !hasToken}
        />
      </div>
    </form>
  );
}

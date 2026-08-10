"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useId, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import PendingSubmitButton from "@/components/auth/pending-submit-button";
import TurnstileComponent from "@/components/auth/turnstile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToast from "@/hooks/use-toast";
import { registerUser } from "@/lib/actions/users";
import { usePublicConfig } from "@/lib/contexts/public-config-context";
import { type FormState, initialState } from "@/lib/utils";
import { type RegisterFormData, registerSchema } from "@/types/auth";

export default function RegisterForm() {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  const [isTransitionPending, startTransition] = useTransition();
  const router = useRouter();
  const publicConf = usePublicConfig();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      "cf-turnstile-response": "",
    },
  });

  const turnstileEnabled = Boolean(publicConf.turnstileSiteKey);
  const [revealTurnstile, setRevealTurnstile] = useState(false);
  const name = watch("name");
  const email = watch("email");
  const password = watch("password");
  const hasToken = Boolean(watch("cf-turnstile-response"));

  useEffect(() => {
    if (
      turnstileEnabled &&
      !revealTurnstile &&
      name?.trim() &&
      email?.trim() &&
      password?.trim()
    ) {
      setRevealTurnstile(true);
    }
  }, [turnstileEnabled, revealTurnstile, name, email, password]);

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

  const onSubmit = async (data: RegisterFormData) => {
    startTransition(() => {
      formAction(data);
    });
  };

  function setTurnstileValue(token: string) {
    setValue("cf-turnstile-response", token);
  }

  const isLoading = isPending || isSubmitting || isTransitionPending;

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor={nameId}>Name</Label>
        <Input
          type="text"
          id={nameId}
          placeholder="John Doe"
          autoComplete="name"
          autoFocus
          {...register("name")}
        />
        {errors.name && (
          <span className="text-destructive text-xs">{errors.name.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={emailId}>Email</Label>
        <Input
          type="email"
          id={emailId}
          placeholder="johndoe@example.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-destructive text-xs">{errors.email.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={passwordId}>Password</Label>
        <Input
          type="password"
          id={passwordId}
          placeholder="****************"
          autoComplete="new-password"
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
        <div className="pb-6 text-muted-foreground text-xs">
          By signing up, you agree to our{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            className="relative inline-flex items-center text-primary hover:underline"
            rel="noopener"
          >
            <span>Privacy Policy</span>
            <ExternalLink size={10} className="relative -top-px ml-1" />
          </a>
        </div>
        <PendingSubmitButton
          isPending={isLoading}
          text="Sign up"
          className="w-full"
          disabled={turnstileEnabled && !hasToken}
        />
      </div>
    </form>
  );
}

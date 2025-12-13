"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import PendingSubmitButton from "@/components/auth/pending-submit-button";
import TurnstileComponent from "@/components/auth/turnstile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToast from "@/hooks/use-toast";
import { registerUser } from "@/lib/actions/users";
import publicConf from "@/lib/public-config";
import { type FormState, initialState } from "@/lib/utils";
import { type RegisterFormData, registerSchema } from "@/types/auth";

export default function RegisterForm() {
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  const [isTransitionPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
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
      <Label htmlFor="name" className="flex flex-col gap-1">
        <span>Name</span>
        <Input
          type="text"
          id="name"
          placeholder="John Doe"
          autoFocus
          {...register("name")}
        />
        {errors.name && (
          <span className="text-destructive text-xs">{errors.name.message}</span>
        )}
      </Label>
      <Label htmlFor="email" className="flex flex-col gap-1">
        <span>Email</span>
        <Input
          type="email"
          id="email"
          placeholder="johndoe@example.com"
          autoComplete="email"
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
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-destructive text-xs">{errors.password.message}</span>
        )}
      </Label>
      <TurnstileComponent turnstileRef={turnstileRef} setValue={setTurnstileValue} />
      <div className="text-muted-foreground text-xs">
        By signing up, you agree to our{" "}
        <a
          href="/privacy-policy"
          target="_blank"
          className="relative inline-flex items-center text-primary hover:underline"
          rel="noopener"
        >
          <span>Privacy Policy</span>
          <ExternalLink size={10} className="-top-px relative ml-1" />
        </a>
      </div>
      <PendingSubmitButton isPending={isLoading} text="Sign up" />
    </form>
  );
}

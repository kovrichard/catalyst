"use client";

import { type FormEvent, useEffect, useState } from "react";
import OAuthButton from "@/components/auth/oauth-button";
import { signIn } from "@/lib/auth-client";
import { usePublicConfig } from "@/lib/contexts/public-config-context";

const providerTitles: Record<string, string> = { google: "Google" };

export default function OAuthForm({ provider }: { provider: string }) {
  const publicConf = usePublicConfig();
  const [isPending, setIsPending] = useState(false);
  const title = providerTitles[provider] ?? provider;

  // Returning from the provider restores this page from the back/forward cache with
  // its state intact, so the button would come back still spinning.
  useEffect(() => {
    const clearPendingOnRestore = () => setIsPending(false);

    window.addEventListener("pageshow", clearPendingOnRestore);
    return () => window.removeEventListener("pageshow", clearPendingOnRestore);
  }, []);

  // The spinner is never cleared on success: the provider redirect takes the page
  // away, and clearing it first would flash the button back to its idle state.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: publicConf.redirectPath,
      });

      if (error) {
        setIsPending(false);
      }
    } catch {
      setIsPending(false);
    }
  }

  return (
    <form className="flex justify-center" onSubmit={handleSubmit}>
      <OAuthButton provider={provider} title={title} isPending={isPending} />
    </form>
  );
}

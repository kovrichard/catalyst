"use client";

import type { FormEvent } from "react";
import OAuthButton from "@/components/auth/oauth-button";
import { signIn } from "@/lib/auth-client";
import { usePublicConfig } from "@/lib/contexts/public-config-context";

export default function OAuthForm({ provider }: { provider: string }) {
  const publicConf = usePublicConfig();
  const config: { title: string } = { title: "" };

  if (provider === "google") {
    config.title = "Google";
  } else if (provider === "github") {
    config.title = "GitHub";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await signIn.social({
      provider,
      callbackURL: publicConf.redirectPath,
    });
  }

  return (
    <form className="flex justify-center" onSubmit={handleSubmit}>
      <OAuthButton provider={provider} title={config.title} />
    </form>
  );
}

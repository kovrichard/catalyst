"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import type { RefObject } from "react";
import { usePublicConfig } from "@/lib/contexts/public-config-context";

export default function TurnstileComponent({
  turnstileRef,
  setValue,
}: Readonly<{
  turnstileRef: RefObject<TurnstileInstance | null>;
  setValue: (token: string) => void;
}>) {
  const publicConf = usePublicConfig();

  if (!publicConf.turnstileSiteKey) {
    return null;
  }

  return (
    <div className="h-[65px]">
      <Turnstile
        ref={turnstileRef}
        className="mx-auto"
        siteKey={publicConf.turnstileSiteKey}
        onSuccess={(token: string) => {
          setValue(token);
        }}
        onError={() => {
          setValue("");
        }}
        onExpire={() => {
          setValue("");
        }}
        onTimeout={() => {
          setValue("");
        }}
      />
    </div>
  );
}

"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import type { RefObject } from "react";
import publicConf from "@/lib/public-config";

export default function TurnstileComponent({
  turnstileRef,
  setValue,
}: Readonly<{
  turnstileRef: RefObject<TurnstileInstance | null>;
  setValue: (token: string) => void;
}>) {
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

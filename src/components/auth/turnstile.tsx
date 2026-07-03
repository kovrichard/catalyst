"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import type { RefObject } from "react";
import { usePublicConfig } from "@/lib/contexts/public-config-context";
import { cn } from "@/lib/utils";

export default function TurnstileComponent({
  turnstileRef,
  setValue,
  show,
}: Readonly<{
  turnstileRef: RefObject<TurnstileInstance | null>;
  setValue: (token: string) => void;
  show: boolean;
}>) {
  const publicConf = usePublicConfig();

  if (!publicConf.turnstileSiteKey) {
    return null;
  }

  return (
    <div
      aria-hidden={!show}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
        show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <div className="pb-6">
          <Turnstile
            ref={turnstileRef}
            className="w-full"
            siteKey={publicConf.turnstileSiteKey}
            options={{ size: "flexible" }}
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
      </div>
    </div>
  );
}

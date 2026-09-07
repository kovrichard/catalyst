"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { type RefObject, useState } from "react";
import { usePublicConfig } from "@/lib/contexts/public-config-context";
import { cn } from "@/lib/utils";

export default function TurnstileComponent({
  turnstileRef,
  setValue,
}: Readonly<{
  turnstileRef: RefObject<TurnstileInstance | null>;
  setValue: (token: string) => void;
}>) {
  const publicConf = usePublicConfig();
  const [isInteractive, setIsInteractive] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);

  if (!publicConf.turnstileSiteKey) {
    return null;
  }

  function acceptToken(token: string) {
    setIsUnavailable(false);
    setValue(token);
  }

  function discardToken() {
    setValue("");
  }

  function reportUnavailable() {
    setIsUnavailable(true);
    setValue("");
  }

  function reportInteractive() {
    setIsInteractive(true);
  }

  const occupiesSpace = isInteractive || isUnavailable;

  return (
    <div
      aria-hidden={!occupiesSpace}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
        occupiesSpace ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden">
        <div className="pb-6">
          <Turnstile
            ref={turnstileRef}
            className="w-full"
            siteKey={publicConf.turnstileSiteKey}
            options={{ size: "flexible", appearance: "interaction-only" }}
            onSuccess={acceptToken}
            onBeforeInteractive={reportInteractive}
            onExpire={discardToken}
            onError={reportUnavailable}
            onTimeout={reportUnavailable}
            onUnsupported={reportUnavailable}
            scriptOptions={{ onError: reportUnavailable }}
          />
          {isUnavailable ? (
            <p className="text-destructive text-xs">
              We could not verify your browser. Disable your ad blocker or refresh the
              page to continue.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

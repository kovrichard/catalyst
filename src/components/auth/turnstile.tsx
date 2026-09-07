"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { type RefObject, useEffect, useState } from "react";
import { usePublicConfig } from "@/lib/contexts/public-config-context";
import { cn } from "@/lib/utils";

const VERIFICATION_TIMEOUT_MS = 10_000;

type Status = "pending" | "solved" | "interactive" | "unavailable";

export default function TurnstileComponent({
  turnstileRef,
  setValue,
}: Readonly<{
  turnstileRef: RefObject<TurnstileInstance | null>;
  setValue: (token: string) => void;
}>) {
  const publicConf = usePublicConfig();
  const [status, setStatus] = useState<Status>("pending");

  // A blocked script never reaches any widget callback, so the only reliable
  // signal is that no token arrived while nothing was asked of the user.
  useEffect(() => {
    if (status !== "pending") {
      return;
    }

    const timer = setTimeout(() => setStatus("unavailable"), VERIFICATION_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [status]);

  if (!publicConf.turnstileSiteKey) {
    return null;
  }

  function acceptToken(token: string) {
    setStatus("solved");
    setValue(token);
  }

  function awaitNewToken() {
    setStatus("pending");
    setValue("");
  }

  function reportUnavailable() {
    setStatus("unavailable");
    setValue("");
  }

  function reportInteractive() {
    setStatus("interactive");
  }

  const occupiesSpace = status === "interactive" || status === "unavailable";

  return (
    <div
      aria-hidden={!occupiesSpace}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
        occupiesSpace ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}
    >
      <div className="overflow-hidden [&>*:last-child]:pb-6">
        <Turnstile
          ref={turnstileRef}
          className="w-full [&>div]:w-full"
          // size:"flexible" makes Cloudflare's own widget fill its container, but
          // appearance:"interaction-only" then pins the wrapper to fit-content. The
          // library spreads `style` last, so this is what actually widens it.
          style={{ width: "100%" }}
          siteKey={publicConf.turnstileSiteKey}
          options={{ size: "flexible", appearance: "interaction-only" }}
          onSuccess={acceptToken}
          onBeforeInteractive={reportInteractive}
          onExpire={awaitNewToken}
          onError={reportUnavailable}
          onTimeout={reportUnavailable}
          onUnsupported={reportUnavailable}
        />
        {status === "unavailable" ? (
          <p className="text-destructive text-xs">
            We could not verify your browser. Disable your ad blocker or refresh the page
            to continue.
          </p>
        ) : null}
      </div>
    </div>
  );
}

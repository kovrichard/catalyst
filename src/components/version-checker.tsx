"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { shouldPromptReload, VERSION_POLL_INTERVAL_MS } from "@/lib/utils/version-check";

// Deliberately plain fetch rather than the app's react-query client: that client
// persists every query to IndexedDB, so a version from a previous session would
// be restored and read as a change on the next page load.
async function fetchServedVersion(signal: AbortSignal): Promise<string | null> {
  try {
    const response = await fetch("/api/version", { signal, cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { version?: string };
    return data.version ?? null;
  } catch {
    return null;
  }
}

export function VersionChecker() {
  const loadedVersion = useRef<string | null>(null);
  const prompted = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    async function check() {
      const servedVersion = await fetchServedVersion(controller.signal);
      if (!servedVersion) {
        return;
      }

      if (!loadedVersion.current) {
        loadedVersion.current = servedVersion;
        return;
      }

      if (
        !shouldPromptReload({
          loadedVersion: loadedVersion.current,
          servedVersion,
          alreadyPrompted: prompted.current,
        })
      ) {
        return;
      }

      prompted.current = true;
      toast.info("A new version is available", {
        description: "Reload to see the latest changes.",
        action: {
          label: "Reload",
          onClick: () => globalThis.location.reload(),
        },
        duration: Number.POSITIVE_INFINITY,
      });
    }

    function checkWhenTabReturns() {
      if (document.visibilityState === "visible") {
        void check();
      }
    }

    void check();
    const poll = setInterval(() => void check(), VERSION_POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", checkWhenTabReturns);

    return () => {
      controller.abort();
      clearInterval(poll);
      document.removeEventListener("visibilitychange", checkWhenTabReturns);
    };
  }, []);

  return null;
}

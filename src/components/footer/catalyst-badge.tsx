"use client";

import { useEffect, useState } from "react";

/**
 * Renders a "Made with Catalyst" badge that links to the Catalyst site with UTM campaign parameters.
 *
 * The badge includes UTM parameters for source (derived from the current hostname), medium (`utm_medium=referral`),
 * and campaign (`utm_campaign=made-with-badge`), combined into the link's query string.
 *
 * @returns A JSX anchor element that opens the Catalyst site in a new tab and includes the constructed UTM query string.
 */
export default function CatalystBadge() {
  const [source, setSource] = useState("");
  const medium = "utm_medium=referral";
  const campaign = "utm_campaign=made-with-badge";

  useEffect(() => {
    setSource(`utm_source=${window.location.hostname}`);
  }, []);

  const queryParams = [source, medium, campaign].filter(Boolean).join("&");

  return (
    <a
      href={`https://catalyst.richardkovacs.dev/?${queryParams}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded border bg-card px-2 py-1 text-foreground text-sm shadow-md transition-colors hover:bg-input/50 dark:bg-input"
    >
      <span>Made with</span>
      {/** biome-ignore lint/performance/noImgElement: Vercel bypass */}
      <img
        src="https://catalyst.richardkovacs.dev/icon.svg"
        alt="Catalyst"
        width={20}
        height={20}
      />
      <span className="font-semibold">Catalyst</span>
    </a>
  );
}
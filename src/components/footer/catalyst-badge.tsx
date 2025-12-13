"use client";

import { useEffect, useState } from "react";

export default function CatalystBadge() {
  const [source, setSource] = useState("");
  const medium = "utm_medium=referral";
  const campaign = "utm_campaign=made-with-badge";

  useEffect(() => {
    setSource(`utm_source=${globalThis.location.hostname}`);
  }, []);

  const queryParams = [source, medium, campaign].filter(Boolean).join("&");

  return (
    <a
      href={`https://catalyst.konvert7.com/?${queryParams}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded border bg-card px-2 py-1 text-foreground text-sm shadow-md transition-colors hover:bg-input/50 dark:bg-input"
    >
      <span>Made with</span>
      {/** biome-ignore lint/performance/noImgElement: Vercel bypass */}
      <img
        src="https://catalyst.konvert7.com/icon.svg"
        alt="Catalyst"
        width={20}
        height={20}
      />
      <span className="font-semibold">Catalyst</span>
    </a>
  );
}

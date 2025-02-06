"use client";

import { useEffect, useState } from "react";

export default function CatalystBadge() {
  const [source, setSource] = useState("");
  const medium = "utm_medium=referral";
  const campaign = "utm_campaign=made-with-badge";

  useEffect(() => {
    setSource(`utm_source=${window.location.hostname}`);
  }, []);

  return (
    <a
      href={`https://catalyst.richardkovacs.dev/?${source}&${medium}&${campaign}`}
      target="_blank"
      className="text-sm py-1 px-2 rounded flex items-center gap-1.5 shadow-md bg-card dark:bg-input border text-foreground hover:bg-input/50 transition-colors"
    >
      <span>Made with</span>
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

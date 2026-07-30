"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function LastUsedIndicator({
  provider,
  className,
}: {
  provider: string;
  className?: string;
}) {
  const [isLastUsed, setIsLastUsed] = useState(false);

  useEffect(() => {
    const lastUsed = localStorage.getItem("catalyst-auth-method") === provider;
    setIsLastUsed(lastUsed);
  }, [provider]);

  return (
    isLastUsed && (
      <span
        className={cn(
          "pointer-events-none absolute -top-2 -right-2 rounded-md border border-primary bg-secondary px-2 py-1 font-semibold text-[10px] text-secondary-foreground uppercase leading-none tracking-wide",
          className
        )}
      >
        Last used
      </span>
    )
  );
}

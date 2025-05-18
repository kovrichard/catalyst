"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Lobster } from "next/font/google";
import { useEffect, useState } from "react";

const lobster = Lobster({ subsets: ["latin"], weight: "400" });

export default function LastUsedIndicator({ provider }: { provider: string }) {
  const [isLastUsed, setIsLastUsed] = useState(false);

  useEffect(() => {
    const lastUsed = localStorage.getItem("catalyst-auth-method") === provider;
    setIsLastUsed(lastUsed);
  }, [provider]);

  return (
    isLastUsed && (
      <div
        className={cn(
          "hidden sm:flex absolute top-0 bottom-0 -right-28 items-center justify-center gap-2 text-foreground text-lg",
          lobster.className
        )}
      >
        <ArrowLeft size={24} />
        <span>Last used</span>
      </div>
    )
  );
}

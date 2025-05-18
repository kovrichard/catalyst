"use client";

import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Lobster } from "next/font/google";
import { useEffect, useState } from "react";

const lobster = Lobster({ subsets: ["latin"], weight: "400" });

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
      <div
        className={cn(
          "flex absolute top-0 bottom-0 right-4 sm:-right-28 items-center justify-center gap-2 text-foreground text-sm sm:text-lg",
          lobster.className,
          className
        )}
      >
        <ArrowLeft size={24} className="hidden sm:block" />
        <span>Last used</span>
      </div>
    )
  );
}

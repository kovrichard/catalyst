"use client";

import { ArrowLeft } from "lucide-react";
import { Lobster } from "next/font/google";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const lobster = Lobster({ subsets: ["latin"], weight: "400" });

/**
 * Displays a "Last used" indicator when the specified auth provider was the last-used method.
 *
 * The component reads the "catalyst-auth-method" value from localStorage and shows a small badge
 * (including an arrow icon and the text "Last used") if that value equals `provider`.
 *
 * @param provider - The authentication provider identifier to compare with the stored last-used method.
 * @param className - Optional additional CSS classes to apply to the indicator container.
 * @returns A JSX element showing the "Last used" indicator when `provider` matches the stored value, or `null` otherwise.
 */
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
          "sm:-right-28 absolute top-0 right-4 bottom-0 flex items-center justify-center gap-2 text-foreground text-sm sm:text-lg",
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
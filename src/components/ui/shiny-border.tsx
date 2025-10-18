"use client";

import type React from "react";
import { cn } from "@/lib/utils";

export function ShinyBorder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group relative", className)}>
      {/* Gray border always visible */}
      <div className="-inset-[1px] absolute rounded-lg border border-border transition-colors duration-300" />

      {/* Rotating steel gradient on hover - blurred light particle */}
      <div className="-inset-[1px] absolute overflow-hidden rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div
          className="-inset-[100px] absolute animate-spin-slow blur-md"
          style={{
            background: `conic-gradient(
              from 0deg at 50% 50%,
              transparent 0deg,
              transparent 70deg,
              hsl(0 100% 0% / 0.4) 80deg,
              hsl(0 100% 0% / 0.9) 90deg,
              hsl(0 100% 0% / 0.4) 100deg,
              transparent 110deg,
              transparent 360deg
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative rounded-lg bg-background">{children}</div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import React from "react";

export function ShinyBorder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative group", className)}>
      {/* Gray border always visible */}
      <div className="absolute -inset-[1px] rounded-lg border border-border transition-colors duration-300" />

      {/* Rotating steel gradient on hover - blurred light particle */}
      <div className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
        <div
          className="absolute -inset-[100px] animate-spin-slow blur-md"
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
      <div className="relative bg-background rounded-lg">{children}</div>
    </div>
  );
}

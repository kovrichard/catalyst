"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

// @catalyst:auth-start

import { TRPCReactProvider } from "@/lib/trpc/client";
// @catalyst:auth-end

export function Providers({ children }: { children: ReactNode }) {
  return (
    // @catalyst:auth-start
    <TRPCReactProvider>
      {/* @catalyst:auth-end */}
      <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        {children}
      </ThemeProvider>
      {/* @catalyst:auth-start */}
    </TRPCReactProvider>
    // @catalyst:auth-end
  );
}

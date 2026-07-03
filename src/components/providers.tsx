"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

// @catalyst:trpc-start

import { TRPCReactProvider } from "@/lib/trpc/client";
// @catalyst:trpc-end

export function Providers({ children }: { children: ReactNode }) {
  return (
    // @catalyst:trpc-start
    <TRPCReactProvider>
      {/* @catalyst:trpc-end */}
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      {/* @catalyst:trpc-start */}
    </TRPCReactProvider>
    // @catalyst:trpc-end
  );
}

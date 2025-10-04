"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { TRPCReactProvider } from "@/lib/trpc/client";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TRPCReactProvider>
      <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </TRPCReactProvider>
  );
}

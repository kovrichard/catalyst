"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { PublicConfig } from "@/lib/public-config";

const PublicConfigContext = createContext<PublicConfig | null>(null);

export function PublicConfigProvider({
  config,
  children,
}: Readonly<{
  config: PublicConfig;
  children: ReactNode;
}>) {
  return (
    <PublicConfigContext.Provider value={config}>{children}</PublicConfigContext.Provider>
  );
}

export function usePublicConfig(): PublicConfig {
  const config = useContext(PublicConfigContext);

  if (config === null) {
    throw new Error("usePublicConfig must be used within a PublicConfigProvider");
  }

  return config;
}

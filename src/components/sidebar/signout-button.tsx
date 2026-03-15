"use client";

import { del } from "idb-keyval";
import { LoaderCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-client";
import { QUERY_CACHE_KEY } from "@/lib/trpc/client";

export function SignOut({ buttonText }: Readonly<{ buttonText: string }>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await del(QUERY_CACHE_KEY);
      await signOut();
    } catch (_) {
      // sign out even if the server call fails
    } finally {
      globalThis.location.href = "/login";
    }
  };

  return (
    <SidebarMenuButton onClick={handleSignOut} disabled={isLoading}>
      {isLoading ? (
        <LoaderCircle className="shrink-0 animate-spin" />
      ) : (
        <LogOut className="shrink-0" />
      )}
      <span>{buttonText}</span>
    </SidebarMenuButton>
  );
}

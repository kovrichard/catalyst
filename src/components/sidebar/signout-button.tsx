"use client";

// @catalyst:trpc-start
import { del } from "idb-keyval";
// @catalyst:trpc-end
import { LoaderCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { signOut } from "@/lib/auth-client";
// @catalyst:trpc-start
import { QUERY_CACHE_KEY } from "@/lib/trpc/client";
// @catalyst:trpc-end

export function SignOut({ buttonText }: Readonly<{ buttonText: string }>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      // @catalyst:trpc-start
      await del(QUERY_CACHE_KEY);
      // @catalyst:trpc-end
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

import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";
import { SessionGate } from "@/components/auth/session-gate";
import BottomNavigation from "@/components/bottom-navigation";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CommandPaletteProvider } from "@/lib/contexts/command-palette-context";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CommandPaletteProvider>
      <SidebarProvider>
        <Suspense fallback={null}>
          <SessionGate />
        </Suspense>
        <AppSidebar />
        <main className="relative flex min-h-screen flex-1 bg-muted/40">
          <div className="flex flex-1 flex-col pb-20 md:pb-0">{children}</div>
        </main>
        <BottomNavigation />
        <CommandPalette />
      </SidebarProvider>
    </CommandPaletteProvider>
  );
}

import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";
import { SessionGate } from "@/components/auth/session-gate";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppSidebarSkeleton } from "@/components/sidebar/app-sidebar-skeleton";
import TopMenu from "@/components/top-menu";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <SessionGate />
      </Suspense>
      <Suspense fallback={<AppSidebarSkeleton />}>
        <AppSidebar />
      </Suspense>
      <main className="relative flex min-h-screen flex-1 bg-muted/40">
        <div className="flex flex-1 flex-col">
          <TopMenu />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

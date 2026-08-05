import type React from "react";
import { Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppSidebarSkeleton } from "@/components/sidebar/app-sidebar-skeleton";
import TopMenu from "@/components/top-menu";
import { SidebarProvider } from "@/components/ui/sidebar";

// @catalyst:auth-start

import { RequireSession } from "@/components/auth/require-session";
// @catalyst:auth-end

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      {/* @catalyst:auth-start */}
      <Suspense fallback={null}>
        <RequireSession />
      </Suspense>
      {/* @catalyst:auth-end */}
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

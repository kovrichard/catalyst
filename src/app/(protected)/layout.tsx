import type React from "react";
import { Suspense } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppSidebarSkeleton } from "@/components/sidebar/app-sidebar-skeleton";
import TopMenu from "@/components/top-menu";
import { SidebarProvider } from "@/components/ui/sidebar";

// @catalyst:auth-start

import { getUserFromSession } from "@/lib/session";
// @catalyst:auth-end

// @catalyst:auth-start
// Blocking, not partially prerendered: a prerendered shell is built without
// request context, so it would be served with a 200 before the session check
// below could run.
export const instant = false;
// @catalyst:auth-end

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // @catalyst:auth-start
  await getUserFromSession();
  // @catalyst:auth-end

  return (
    <SidebarProvider>
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

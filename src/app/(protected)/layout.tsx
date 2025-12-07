import { cookies } from "next/headers";
import type React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import TopMenu from "@/components/top-menu";
import { SidebarProvider } from "@/components/ui/sidebar";

// @catalyst:auth-start

import { getUserFromSession } from "@/lib/services/user.service";
// @catalyst:auth-end

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // @catalyst:auth-start
  await getUserFromSession();
  // @catalyst:auth-end
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar:state");
  const defaultOpen = sidebarState ? sidebarState.value === "true" : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="relative flex min-h-screen flex-1 bg-gray-100">
        <div className="flex flex-1 flex-col">
          <TopMenu />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

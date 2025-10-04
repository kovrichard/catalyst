import { cookies } from "next/headers";
import type React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import TopMenu from "@/components/top-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getUserFromSession } from "@/lib/dao/users";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await getUserFromSession();
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar:state");
  const defaultOpen = sidebarState ? sidebarState.value === "true" : true;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="relative flex flex-1 min-h-screen bg-gray-100">
        <div className="flex-1 flex flex-col">
          <TopMenu />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}

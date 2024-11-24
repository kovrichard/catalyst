import { AppSidebar } from "@/components/app-sidebar";
import { CustomSidebarTrigger } from "@/components/sidebar-trigger";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="relative flex flex-1 min-h-screen bg-gray-100">
        <CustomSidebarTrigger className="absolute" />
        <div className="flex-1 flex">{children}</div>
      </main>
    </SidebarProvider>
  );
}

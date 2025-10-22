import { cookies } from "next/headers";
import type React from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import TopMenu from "@/components/top-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getUserFromSession } from "@/lib/services/user.service";

/**
 * Application layout wrapper that provides sidebar state, top navigation, and page content.
 *
 * Ensures the user's session is loaded before rendering, reads the "sidebar:state" cookie to determine
 * the SidebarProvider's `defaultOpen` (open when the cookie is missing or its value is `"true"`),
 * and renders the AppSidebar, TopMenu, and the supplied children within the main layout.
 *
 * @param children - The page content to render inside the layout
 * @returns The React element containing the SidebarProvider, AppSidebar, top navigation, and provided children
 */
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
      <main className="relative flex min-h-screen flex-1 bg-gray-100">
        <div className="flex flex-1 flex-col">
          <TopMenu />
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
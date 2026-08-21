import Image from "next/image";
import Link from "next/link";
import { SearchTrigger } from "@/components/command-palette/search-trigger";

// @catalyst:auth-start

import { ChevronsUpDown } from "lucide-react";
import { Suspense } from "react";
import ProfileMenu from "@/components/auth/profile-menu";
import { SignInButton } from "@/components/auth/sign-in-button";
import NotificationMenu from "@/components/notifications/notification-menu";
import { SidebarUserSkeleton } from "@/components/sidebar/app-sidebar-skeleton";
import { NavMain } from "@/components/sidebar/nav-main";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getChromeUser } from "@/lib/session";
// @catalyst:auth-end

// Synchronous on purpose: the logo and rail carry no data, so awaiting the
// session here would hold the whole sidebar behind a fallback. Only the footer
// user block reads the session, and it suspends on its own.
export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <SidebarMenu className="min-w-0 flex-1">
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="Catalyst">
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center">
                    <Image alt="Catalyst" height={28} src="/icon.svg" width={28} />
                  </div>
                  <span className="truncate font-semibold">Catalyst</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* @catalyst:auth-start */}
          <span className="group-data-[collapsible=icon]:hidden">
            <NotificationMenu />
          </span>
          {/* @catalyst:auth-end */}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SearchTrigger />
        <NavMain />
      </SidebarContent>
      {/* @catalyst:auth-start */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Suspense fallback={<SidebarUserSkeleton />}>
              <SidebarUser />
            </Suspense>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* @catalyst:auth-end */}
      <SidebarRail />
    </Sidebar>
  );
}

// @catalyst:auth-start
async function SidebarUser() {
  const user = await getChromeUser();

  if (!user) {
    return <SignInButton />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.image || ""} alt={user?.name || "U"} />
            <AvatarFallback className="rounded-lg">
              {user?.name
                ?.split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("") || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.name || "Anonymous"}</span>
            {user?.email && <span className="truncate text-xs">{user.email}</span>}
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <ProfileMenu
        userName={user.name}
        userEmail={user.email}
        userImage={user.image || undefined}
      />
    </DropdownMenu>
  );
}
// @catalyst:auth-end

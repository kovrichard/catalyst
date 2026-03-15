import Image from "next/image";
import Link from "next/link";

// @catalyst:auth-start

import { ChevronsUpDown } from "lucide-react";
import ProfileMenu from "@/components/auth/profile-menu";
import { SignInButton } from "@/components/auth/sign-in-button";
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
} from "@/components/ui/sidebar";
import { getUserFromSession } from "@/lib/services/user.service";
// @catalyst:auth-end

export async function AppSidebar() {
  // @catalyst:auth-start
  const user = await getUserFromSession();
  // @catalyst:auth-end

  return (
    <Sidebar>
      <SidebarHeader className="py-3.5 pl-[22px]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/icon.svg" alt="Catalyst" width={28} height={28} />
          Catalyst
        </Link>
      </SidebarHeader>
      <SidebarContent />
      {/* @catalyst:auth-start */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user ? (
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
                      <span className="truncate font-medium">
                        {user?.name || "Anonymous"}
                      </span>
                      {user?.email && (
                        <span className="truncate text-xs">{user.email}</span>
                      )}
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
            ) : (
              <SignInButton />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* @catalyst:auth-end */}
    </Sidebar>
  );
}

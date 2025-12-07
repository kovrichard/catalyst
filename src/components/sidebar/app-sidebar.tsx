import Image from "next/image";
import Link from "next/link";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";

// @catalyst:auth-start

import ProfileMenu from "@/components/auth/profile-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
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
      <SidebarFooter className="p-3.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="h-auto">
                <SidebarMenuButton>
                  <Avatar className="size-7">
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="text-muted-foreground">
                      {user?.name
                        ?.split(" ")
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("") || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <p>{user?.name || "Anonymous"}</p>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 md:w-60">
                <ProfileMenu />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* @catalyst:auth-end */}
    </Sidebar>
  );
}

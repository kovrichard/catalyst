import Image from "next/image";
import Link from "next/link";
import ProfileMenu from "@/components/sidebar/profile-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

/**
 * Render the application sidebar with header, main content area, and a footer that exposes the current user's profile menu.
 *
 * The header links to the dashboard and displays the app icon and name. The footer shows the user's avatar (or initials/default) and name as a dropdown trigger; the dropdown contains the profile menu. User data is loaded from the current session.
 *
 * @returns The JSX element for the application's sidebar including header, content, and footer with the user avatar and profile dropdown.
 */
export async function AppSidebar() {
  const user = await getUserFromSession();

  return (
    <Sidebar>
      <SidebarHeader className="py-3.5 pl-[22px]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/icon.svg" alt="Catalyst" width={28} height={28} />
          Catalyst
        </Link>
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter className="p-3.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="h-auto">
                <SidebarMenuButton>
                  <Avatar className="size-7">
                    <AvatarImage src={user?.picture || ""} />
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
    </Sidebar>
  );
}
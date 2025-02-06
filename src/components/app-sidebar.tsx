import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { SignOut } from "./signout-button";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="pl-[22px] py-3.5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/icon.svg" alt="Catalyst" width={28} height={28} />
          Catalyst
        </Link>
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter className="p-3.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SignOut />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

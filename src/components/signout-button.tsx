"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { SidebarMenuButton } from "./ui/sidebar";

export function SignOut() {
  return (
    <SidebarMenuButton className="cursor-pointer" onClick={() => signOut()}>
      <LogOut />
      Sign Out
    </SidebarMenuButton>
  );
}

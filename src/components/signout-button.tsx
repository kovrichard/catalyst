"use client";

import { signOut } from "next-auth/react";
import { SidebarMenuButton } from "./ui/sidebar";

export function SignOut() {
  return <SidebarMenuButton onClick={() => signOut()}>Sign Out</SidebarMenuButton>;
}

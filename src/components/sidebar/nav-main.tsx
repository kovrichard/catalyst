"use client";

import type { LucideIcon } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

function NavItemView({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
        <Link className="h-12 px-3" href={item.href}>
          <Icon />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// The path is read in a suspended child so the group prerenders: a client hook
// that reads the URL at the top level blocks prerendering of the whole route.
function ActiveNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();

  return <NavItemView active={pathname.startsWith(item.href)} item={item} />;
}

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <Suspense
              fallback={<NavItemView active={false} item={item} />}
              key={item.href}
            >
              <ActiveNavItem item={item} />
            </Suspense>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

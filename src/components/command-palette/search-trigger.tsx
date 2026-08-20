"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCommandPalette } from "@/lib/contexts/command-palette-context";

function isApplePlatform(): boolean {
  return /Mac|iPhone|iPad/.test(navigator.platform);
}

function useShortcutLabel(): string {
  const [label, setLabel] = useState("");
  useEffect(() => {
    setLabel(isApplePlatform() ? "⌘K" : "Ctrl K");
  }, []);
  return label;
}

export function SearchTrigger() {
  const { setOpen } = useCommandPalette();
  const shortcut = useShortcutLabel();

  return (
    <SidebarGroup className="pb-0">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10 border border-input bg-background text-muted-foreground shadow-xs hover:bg-background"
              onClick={() => setOpen(true)}
              tooltip={`Search · ${shortcut || "⌘K"}`}
            >
              <Search />
              <span className="flex-1 text-left">Search…</span>
              {shortcut ? (
                <kbd className="pointer-events-none rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
                  {shortcut}
                </kbd>
              ) : null}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

"use client";

import { LayoutDashboard, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCommandPalette } from "@/lib/contexts/command-palette-context";

const PAGES = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Settings", href: "/settings", Icon: Settings },
];

function isPaletteShortcut(event: KeyboardEvent): boolean {
  return event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
}

/** @lintignore */
export function usePaletteNavigation() {
  const { setOpen } = useCommandPalette();
  const router = useRouter();

  return useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router, setOpen]
  );
}

export function CommandPalette({ children }: { children?: React.ReactNode }) {
  const { open, setOpen } = useCommandPalette();
  const go = usePaletteNavigation();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isPaletteShortcut(event)) return;
      event.preventDefault();
      setOpen(!open);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  return (
    <CommandDialog
      description="Search the app or jump to a page"
      onOpenChange={setOpen}
      open={open}
      showCloseButton={false}
      title="Search"
    >
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>Nothing matches.</CommandEmpty>

        {children}
        {children ? <CommandSeparator /> : null}

        <CommandGroup heading="Pages">
          {PAGES.map(({ label, href, Icon }) => (
            <CommandItem key={href} onSelect={() => go(href)}>
              <Icon />
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      <div className="flex items-center gap-4 border-t px-3 py-2 text-muted-foreground text-xs">
        <span>
          <kbd className="font-mono">↑↓</kbd> navigate
        </span>
        <span>
          <kbd className="font-mono">↵</kbd> open
        </span>
        <span>
          <kbd className="font-mono">esc</kbd> close
        </span>
      </div>
    </CommandDialog>
  );
}

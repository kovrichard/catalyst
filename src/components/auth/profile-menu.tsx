"use client";

import { ExternalLink, FileText, Monitor, Moon, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SignOut } from "@/components/sidebar/signout-button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const THEME_OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

// @catalyst:trpc-start
// @catalyst:stripe-start

import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { useTRPC } from "@/lib/trpc/client";
// @catalyst:stripe-end
// @catalyst:trpc-end

export default function ProfileMenu({
  userName,
  userEmail,
  userImage,
}: Readonly<{
  userName: string;
  userEmail: string;
  userImage?: string;
}>) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const ActiveThemeIcon =
    THEME_OPTIONS.find((option) => option.value === theme)?.Icon ?? Moon;

  // @catalyst:trpc-start
  // @catalyst:stripe-start
  const trpc = useTRPC();
  const { data: billingPortalUrl, refetch } = useQuery(
    trpc.billingPortal.queryOptions(undefined, {
      meta: { persist: false },
    })
  );

  useEffect(() => {
    void refetch();
  }, [refetch]);
  // @catalyst:stripe-end
  // @catalyst:trpc-end

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="rounded-lg">
              {userName
                ?.split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("") || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{userName || "Anonymous"}</span>
            <span className="truncate text-xs">{userEmail}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {/* @catalyst:trpc-start */}
      {/* @catalyst:stripe-start */}
      {billingPortalUrl && (
        <DropdownMenuItem className="h-10 p-0">
          <a
            href={billingPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-full items-center gap-2 px-2 py-1.5"
          >
            <CreditCard className="shrink-0" />
            <span>Billing</span>
          </a>
        </DropdownMenuItem>
      )}
      {/* @catalyst:stripe-end */}
      {/* @catalyst:trpc-end */}
      <DropdownMenuItem className="cursor-pointer p-0" asChild>
        <Link href="/settings" className="flex size-full items-center gap-2 px-2 py-1.5">
          <Settings className="shrink-0" />
          <span>Settings</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="p-0">
        <a
          href="/privacy-policy"
          target="_blank"
          className="flex size-full items-center gap-2 px-2 py-1.5"
          rel="noopener"
        >
          <FileText className="shrink-0" />
          <span className="relative">
            Privacy Policy
            <ExternalLink className="absolute top-0 -right-4 h-3! w-3!" />
          </span>
        </a>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <div className="flex items-center justify-between gap-2 px-2 py-1.5">
        <div className="flex items-center gap-2 text-sm">
          <ActiveThemeIcon className="size-4 shrink-0 text-muted-foreground" />
          Theme
        </div>
        <ToggleGroup
          type="single"
          value={mounted ? theme : ""}
          onValueChange={(value) => value && setTheme(value)}
          className="gap-0.5 rounded-md bg-muted p-0.5"
        >
          {THEME_OPTIONS.map(({ value, label, Icon }) => (
            <ToggleGroupItem
              key={value}
              value={value}
              aria-label={label}
              className="size-7 min-w-0 rounded-[5px] p-0 text-muted-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm"
            >
              <Icon className="size-3.5" />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <SignOut buttonText="Sign Out" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

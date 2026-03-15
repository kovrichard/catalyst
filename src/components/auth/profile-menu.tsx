"use client";

import { ExternalLink, FileText, Settings } from "lucide-react";
import Link from "next/link";
import { SignOut } from "@/components/sidebar/signout-button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// @catalyst:stripe-start

import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { useEffect } from "react";
import { useTRPC } from "@/lib/trpc/client";
// @catalyst:stripe-end

export default function ProfileMenu({
  userName,
  userEmail,
  userImage,
}: Readonly<{
  userName: string;
  userEmail: string;
  userImage?: string;
}>) {
  // @catalyst:stripe-start
  const trpc = useTRPC();
  const { data: billingPortalUrl, refetch } = useQuery(
    trpc.billingPortal.queryOptions(undefined, {
      meta: { persist: false },
    })
  );

  useEffect(() => {
    refetch();
  }, [refetch]);
  // @catalyst:stripe-end

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
      <DropdownMenuItem asChild>
        <SignOut buttonText="Sign Out" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

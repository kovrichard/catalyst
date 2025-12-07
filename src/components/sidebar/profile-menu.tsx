"use client";

import { FileText, Settings } from "lucide-react";
import Link from "next/link";
import { SignOut } from "@/components/signout-button";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

// @catalyst:stripe-start

import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { useEffect } from "react";
import { useTRPC } from "@/lib/trpc/client";
// @catalyst:stripe-end

export default function ProfileMenu() {
  const { isMobile, setOpenMobile } = useSidebar();
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
    <>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
      <DropdownMenuItem className="h-10 p-0">
        <Link
          href="/settings"
          className="flex size-full items-center gap-2 px-2 py-1.5"
          onClick={() => isMobile && setOpenMobile(false)}
        >
          <Settings className="shrink-0" />
          <span>Settings</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="h-10 p-0">
        <a
          href="/privacy-policy"
          target="_blank"
          className="flex size-full items-center gap-2 px-2 py-1.5"
          onClick={() => isMobile && setOpenMobile(false)}
          rel="noopener"
        >
          <FileText className="shrink-0" />
          <span>Privacy Policy</span>
        </a>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <SignOut buttonText="Sign Out" />
      </DropdownMenuItem>
    </>
  );
}

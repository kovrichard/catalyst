"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, FileText, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useTRPC } from "@/lib/trpc/client";
import { SignOut } from "../signout-button";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

export default function ProfileMenu() {
  const { isMobile, setOpenMobile } = useSidebar();
  const trpc = useTRPC();
  const { data: billingPortalUrl, refetch } = useQuery(
    trpc.billingPortal.queryOptions(undefined, {
      meta: { persist: false },
    })
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {billingPortalUrl && (
        <DropdownMenuItem className="p-0 h-10">
          <a
            href={billingPortalUrl}
            target="_blank"
            className="flex items-center gap-2 size-full px-2 py-1.5"
          >
            <CreditCard className="shrink-0" />
            <span>Billing</span>
          </a>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem className="p-0 h-10">
        <Link
          href="/settings"
          className="flex items-center gap-2 size-full px-2 py-1.5"
          onClick={() => isMobile && setOpenMobile(false)}
        >
          <Settings className="shrink-0" />
          <span>Settings</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="p-0 h-10">
        <a
          href="/privacy-policy"
          target="_blank"
          className="flex items-center gap-2 size-full px-2 py-1.5"
          onClick={() => isMobile && setOpenMobile(false)}
          rel="noopener"
        >
          <FileText className="shrink-0" />
          <span>Privacy Policy</span>
        </a>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <SignOut />
      </DropdownMenuItem>
    </>
  );
}

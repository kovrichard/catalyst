import Image from "next/image";
import Link from "next/link";
import type React from "react";
import CatalystBadge from "@/components/footer/catalyst-badge";

// @catalyst:auth-start

import { Suspense } from "react";
import { AuthNav, AuthNavSkeleton } from "@/components/auth/auth-nav";
// @catalyst:auth-end

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <header className="container flex w-full items-center justify-end gap-4 py-4">
        <Link
          href="/"
          className="mr-auto flex items-center gap-2 whitespace-pre font-medium text-lg"
        >
          <Image src="/icon.svg" alt="Catalyst" width={30} height={30} />
          Catalyst
        </Link>
        {/* @catalyst:auth-start */}
        <Suspense fallback={<AuthNavSkeleton />}>
          <AuthNav />
        </Suspense>
        {/* @catalyst:auth-end */}
      </header>
      {children}
      <footer className="container flex w-full justify-start py-4">
        <CatalystBadge />
      </footer>
    </div>
  );
}

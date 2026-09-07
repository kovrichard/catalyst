import type React from "react";
import BrandLink from "@/components/brand-link";
import CatalystBadge from "@/components/footer/catalyst-badge";
import { JsonLd, organizationLd, webSiteLd } from "@/components/marketing/json-ld";

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
      <JsonLd data={organizationLd()} />
      <JsonLd data={webSiteLd()} />
      <header className="container flex w-full items-center justify-end gap-4 py-4">
        <BrandLink />
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

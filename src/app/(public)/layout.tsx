import type React from "react";
import BrandLink from "@/components/brand-link";
import CatalystBadge from "@/components/footer/catalyst-badge";
import GithubStars from "@/components/github-stars";
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
    <div className="dark flex w-full flex-1 flex-col text-foreground">
      <JsonLd data={organizationLd()} />
      <JsonLd data={webSiteLd()} />
      <header className="container flex h-header w-full items-center justify-end gap-4">
        <BrandLink />
        <GithubStars />
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

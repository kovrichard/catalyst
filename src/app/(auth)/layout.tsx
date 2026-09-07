import type React from "react";
import BrandLink from "@/components/brand-link";
import { JsonLd, organizationLd, webSiteLd } from "@/components/marketing/json-ld";

// Only the logo: no navigation to wander off through and no footer, so the form
// is the single thing on the page.
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full flex-1 flex-col">
      <JsonLd data={organizationLd()} />
      <JsonLd data={webSiteLd()} />
      <header className="container flex w-full items-center p-4">
        <BrandLink />
      </header>
      {children}
    </div>
  );
}

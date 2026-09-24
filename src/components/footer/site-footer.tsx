import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ReactNode } from "react";
import BrandLink from "@/components/brand-link";
import CatalystBadge from "@/components/footer/catalyst-badge";
import GithubStars from "@/components/github-stars";
import { mono } from "@/components/marketing/fonts";
import { cn } from "@/lib/utils";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

function SitemapLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="transition-colors hover:text-foreground">
      {children}
    </Link>
  );
}

export default async function SiteFooter({ className = "" }: { className?: string }) {
  const year = await currentYear();

  return (
    <footer className={cn("w-full", className)}>
      <div className="container flex flex-col gap-16 py-16">
        <div className="flex items-start justify-between gap-8">
          <div className="flex min-w-0 flex-col items-start gap-4">
            <BrandLink />
            <p
              className={cn(
                mono.className,
                "text-muted-foreground text-xs uppercase tracking-[0.2em]"
              )}
            >
              The Next.js starter for building with AI
            </p>
          </div>
          <GithubStars className="flex shrink-0" />
        </div>
        <div className="flex flex-col gap-8 text-muted-foreground text-sm sm:grid sm:grid-cols-3 sm:items-center">
          <nav aria-label="Sitemap" className="flex flex-wrap gap-x-8 gap-y-2">
            {/* @catalyst:auth-start */}
            <SitemapLink href="/login">Log in</SitemapLink>
            <SitemapLink href="/register">Register</SitemapLink>
            {/* @catalyst:auth-end */}
            <SitemapLink href="/privacy-policy">Privacy policy</SitemapLink>
          </nav>
          <div className="flex items-center justify-between gap-8 sm:contents">
            <p className="sm:text-center">© {year} Konvert7</p>
            <div className="sm:justify-self-end">
              <CatalystBadge />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import OAuthForm from "@/components/auth/oauth-form";
import conf from "@/lib/config";

export default function AuthCard({
  title,
  description,
  children,
  ctaQuestion,
  ctaText,
  ctaLink,
  showOAuth = true,
}: {
  title: string;
  description: string;
  children: ReactNode;
  ctaQuestion?: string;
  ctaText?: string;
  ctaLink?: string;
  showOAuth?: boolean;
}) {
  const hasGitHub = Boolean(conf.githubId) && Boolean(conf.githubSecret);
  const hasGoogle = Boolean(conf.googleId) && Boolean(conf.googleSecret);
  const oauth = showOAuth && (hasGitHub || hasGoogle);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 rounded-2xl border bg-card p-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      {children}

      {oauth && (
        <div className="flex flex-col gap-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>
          {hasGoogle && <OAuthForm provider="google" />}
          {hasGitHub && <OAuthForm provider="github" />}
        </div>
      )}

      {ctaQuestion && ctaText && ctaLink && (
        <p className="text-center">
          <span className="text-muted-foreground text-sm">{ctaQuestion}</span>{" "}
          <Link
            href={ctaLink}
            className="font-semibold text-sm underline-offset-4 hover:underline"
          >
            {ctaText}
          </Link>
        </p>
      )}
    </div>
  );
}

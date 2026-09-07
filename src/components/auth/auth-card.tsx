import Link from "next/link";
import type { ReactNode } from "react";
import OAuthForm from "@/components/auth/oauth-form";
import PasskeySignInButton from "@/components/auth/passkey-sign-in-button";
import conf from "@/lib/config";

function Divider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-card px-2 text-muted-foreground">OR</span>
      </div>
    </div>
  );
}

export default function AuthCard({
  title,
  description,
  children,
  ctaQuestion,
  ctaText,
  ctaLink,
  showOAuth = true,
  showPasskey = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  ctaQuestion?: string;
  ctaText?: string;
  ctaLink?: string;
  showOAuth?: boolean;
  showPasskey?: boolean;
}) {
  const hasGoogle = Boolean(conf.googleId) && Boolean(conf.googleSecret);
  const oauth = showOAuth && hasGoogle;
  const hasProviders = oauth || showPasskey;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-5 rounded-2xl border bg-card p-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>

      {hasProviders ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            {oauth ? <OAuthForm provider="google" /> : null}
            {showPasskey ? <PasskeySignInButton /> : null}
          </div>
          <Divider />
        </div>
      ) : null}

      {children}

      {ctaQuestion && ctaText && ctaLink ? (
        <p className="text-center">
          <span className="text-muted-foreground text-sm">{ctaQuestion}</span>{" "}
          <Link
            href={ctaLink}
            className="font-semibold text-sm underline-offset-4 hover:underline"
          >
            {ctaText}
          </Link>
        </p>
      ) : null}
    </div>
  );
}

import Link from "next/link";
import { type ReactNode, Suspense } from "react";
import { AuthProvidersSkeleton } from "@/components/auth/auth-card-skeleton";
import AuthProviders from "@/components/auth/auth-providers";

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
  const providerCount = (showOAuth ? 1 : 0) + (showPasskey ? 1 : 0);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-5 rounded-2xl border bg-card p-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>

      {providerCount > 0 ? (
        <Suspense fallback={<AuthProvidersSkeleton actions={providerCount} />}>
          <AuthProviders showOAuth={showOAuth} showPasskey={showPasskey} />
        </Suspense>
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

import Link from "next/link";
import type { ReactNode } from "react";
import OAuthForm from "@/components/auth/oauth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import conf from "@/lib/config";

export default function AuthCard({
  title,
  description,
  children,
  ctaQuestion,
  ctaText,
  ctaLink,
}: {
  title: string;
  description: string;
  children: ReactNode;
  ctaQuestion: string;
  ctaText: string;
  ctaLink: string;
}) {
  const hasGitHub = Boolean(conf.githubId) && Boolean(conf.githubSecret);
  const hasGoogle = Boolean(conf.googleId) && Boolean(conf.googleSecret);

  return (
    <Card className="w-92 p-2">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {children}
        {(hasGitHub || hasGoogle) && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        )}
        {hasGoogle && <OAuthForm provider="google" />}
        {hasGitHub && <OAuthForm provider="github" />}
      </CardContent>
      <CardFooter>
        <p className="mx-auto">
          <span className="text-muted-foreground text-sm">{ctaQuestion}</span>{" "}
          <Link href={ctaLink} className="font-semibold text-sm">
            {ctaText}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

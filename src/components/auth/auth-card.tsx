import conf from "@/lib/config";
import Link from "next/link";
import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import OAuthForm from "./oauth-form";

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
    <Card className="w-80 p-1 lg:p-3">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {children}
        {(hasGitHub || hasGoogle) && (
          <p className="mx-auto text-sm text-muted-foreground">or continue with</p>
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

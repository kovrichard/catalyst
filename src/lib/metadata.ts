import type { Metadata } from "next";
import conf from "@/lib/config";

export const robotsPolicy: Metadata["robots"] = conf.isProductionEnvironment
  ? "index, follow"
  : "noindex, nofollow";

export const metaTitle = "Catalyst - The Next.js Starter for Building with AI";
export const metaDescription =
  "Build your product, not your setup. The Next.js starter where your agent reviews itself and your app speaks MCP from day one.";
export const siteUrl = "https://catalyst.konvert7.com";

// metadataBase freezes into the prerendered shell, so it must resolve at build time.
// ENVIRONMENT is a Docker build ARG; SCHEME/AUTHORITY only arrive at runtime. Add your
// own deploy targets here so each one advertises its own origin.
const buildTimeOriginByEnvironment: Record<string, string> = {
  production: siteUrl,
};

export const deployUrl =
  buildTimeOriginByEnvironment[conf.environment] ?? "http://localhost:3000";

export const openGraph: Metadata["openGraph"] = {
  title: metaTitle,
  description: metaDescription,
  type: "website",
  siteName: "Catalyst",
  locale: "en_US",
  images: [
    {
      url: "/opengraph-image.png",
      width: 1200,
      height: 630,
    },
  ],
};

export const twitter: Metadata["twitter"] = {
  title: metaTitle,
  description: metaDescription,
  card: "summary_large_image",
  images: [
    {
      url: "/twitter-image.png",
      width: 1200,
      height: 630,
    },
  ],
};

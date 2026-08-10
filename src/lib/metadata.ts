import type { Metadata } from "next";
import conf from "@/lib/config";

export const robotsPolicy: Metadata["robots"] = conf.isProductionEnvironment
  ? "index, follow"
  : "noindex, nofollow";

export const metaTitle = "Catalyst - Agentic Next.js Boilerplate";
export const metaDescription =
  "Catalyst is a Next.js starter kit that helps you build modern web applications faster and easier than ever before.";
export const siteUrl = "https://catalyst.konvert7.com";

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

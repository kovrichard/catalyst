import { Metadata } from "next";

export const metaTitle = "Catalyst - Next.js Starter Kit";
export const metaDescription =
  "Catalyst is a Next.js starter kit that helps you build modern web applications faster and easier than ever before.";
export const canonicalUrl = "https://catalyst.richardkovacs.dev";

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

import { Metadata } from "next";

export const metaTitle = "Catalyst - Next.js Starter Kit";
export const metaDescription =
  "Catalyst is a Next.js starter kit that helps you build modern web applications faster and easier than ever before.";

export const openGraph: Metadata["openGraph"] = {
  title: metaTitle,
  description: metaDescription,
  type: "website",
  siteName: "Catalyst",
  locale: "en_US",
};

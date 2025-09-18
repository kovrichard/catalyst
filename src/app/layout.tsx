import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/analytics";
import CookiePopup from "@/components/cookie-popup";
import { Providers } from "@/components/providers";
import { canonicalUrl, metaDescription, metaTitle, openGraph } from "@/lib/metadata";
import publicConf from "@/lib/public-config";
import { cn } from "@/lib/utils";
import React from "react";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(publicConf.host),
  alternates: {
    canonical: canonicalUrl,
  },
  title: metaTitle,
  description: metaDescription,
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  // creator: "",
  robots: "index, follow",
  openGraph: {
    ...openGraph,
    url: publicConf.host,
  },
  twitter: {
    // creator: "@",
    card: "summary_large_image",
    title: metaTitle,
    description: metaDescription,
  },
  category: "",
  keywords: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Analytics />
      </head>
      <body
        className={cn(inter.className, "flex flex-col min-h-svh min-w-80 justify-center")}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <CookiePopup />
      </body>
    </html>
  );
}

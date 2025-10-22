import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type React from "react";
import { Toaster } from "sonner";
import Analytics from "@/components/analytics";
import CookiePopup from "@/components/cookie-popup";
import { Providers } from "@/components/providers";
import { canonicalUrl, metaDescription, metaTitle, openGraph } from "@/lib/metadata";
import publicConf from "@/lib/public-config";
import { cn } from "@/lib/utils";

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
  generator: "Catalyst",
};

/**
 * Wraps page content with application-wide layout, providers, and global UI (analytics, toasts, cookie consent).
 *
 * Renders the root HTML structure (<html>, <head>, <body>) and composes global components: Analytics in the head, Providers around page content and the Toaster, and a CookiePopup outside Providers.
 *
 * @param children - The page content to render inside the layout
 * @returns The root HTML element tree for the application including global providers and UI components
 */
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
        className={cn(inter.className, "flex min-h-svh min-w-80 flex-col justify-center")}
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
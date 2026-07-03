import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type React from "react";
import { Toaster } from "sonner";
import Analytics from "@/components/analytics";
import CookiePopup from "@/components/cookie-popup";
import { Providers } from "@/components/providers";
import conf from "@/lib/config";
import { PublicConfigProvider } from "@/lib/contexts/public-config-context";
import { canonicalUrl, metaDescription, metaTitle, openGraph } from "@/lib/metadata";
import publicConf from "@/lib/public-config";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(conf.host),
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
    url: conf.host,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark scroll-smooth"
      data-scroll-behavior="smooth"
    >
      <head>
        <Analytics
          environment={conf.environment}
          gaId={publicConf.gaId}
          gtmId={publicConf.gtmId}
          googleAdsId={publicConf.googleAdsId}
          clarityId={publicConf.clarityId}
        />
      </head>
      <body
        className={cn(inter.className, "flex min-h-svh min-w-80 flex-col justify-center")}
      >
        {process.env.NODE_ENV === "development" && process.env.REACT_SCAN === "true" && (
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            crossOrigin="anonymous"
          />
        )}
        <Providers>
          <PublicConfigProvider config={publicConf}>{children}</PublicConfigProvider>
          <Toaster />
        </Providers>
        <CookiePopup />
      </body>
    </html>
  );
}

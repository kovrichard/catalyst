import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/analytics";
import conf from "@/lib/config";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import React from "react";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

const title = "Catalyst - Next.js Starter Kit";
const description =
  "Catalyst is a Next.js starter kit that helps you build modern web applications faster and easier than ever before.";
const url = conf.frontendUrl;

export const metadata: Metadata = {
  metadataBase: new URL(url),
  alternates: {
    canonical: url,
  },
  title: title,
  description: description,
  // creator: "",
  robots: "index, follow",
  openGraph: {
    title: title,
    description: description,
    type: "website",
    url: url,
    siteName: "Catalyst",
  },
  twitter: {
    // creator: "@",
    card: "summary_large_image",
    title: title,
    description: description,
  },
  icons: "/favicon.ico",
  category: "",
  keywords: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Analytics />
      </head>
      <body
        className={cn(inter.className, "flex flex-col min-h-svh min-w-80 justify-center")}
      >
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

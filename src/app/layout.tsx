import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import React from "react";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

const title = "Catalyst - Next.js Starter Kit";
const description =
  "Catalyst is a Next.js starter kit that helps you build modern web applications faster and easier than ever before.";
const url = process.env.FRONTEND_URL || "http://localhost:3000";

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
      <body className={cn(inter.className, "flex min-h-svh min-w-[360px]")}>
        {children}
        <Toaster />
        <a
          href="https://github.com/kovrichard/catalyst"
          target="_blank"
          className="fixed text-sm bottom-4 left-4 py-1 px-2 rounded flex items-center gap-1.5 shadow-lg hover:bg-slate-100 transition border border-slate-400 hover:border-slate-600"
        >
          <span>Made with</span>
          <img
            src="https://raw.githubusercontent.com/kovrichard/catalyst/refs/heads/main/src/app/icon.png"
            alt="Catalyst"
            width={20}
            height={20}
          />
          <span className="font-semibold">Catalyst</span>
        </a>
      </body>
    </html>
  );
}

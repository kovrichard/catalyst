import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { auth } from "@/auth";
import CatalystBadge from "@/components/footer/catalyst-badge";
import { Button } from "@/components/ui/button";

/**
 * Root layout component that renders a header with navigation, the page content, and a footer.
 *
 * Displays a Dashboard button when a user session exists; otherwise shows Login and Register links.
 *
 * @param children - Content to render between the header and footer
 * @returns The rendered layout node containing header, the provided children, and footer
 */
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="flex w-full flex-1 flex-col">
      <header className="container flex w-full items-center justify-end gap-4 py-4">
        <Link
          href="/"
          className="mr-auto flex items-center gap-2 whitespace-pre font-medium text-lg"
        >
          <Image src="/icon.svg" alt="Catalyst" width={30} height={30} />
          Catalyst
        </Link>
        {session ? (
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </>
        )}
      </header>
      {children}
      <footer className="container flex w-full justify-start py-4">
        <CatalystBadge />
      </footer>
    </div>
  );
}
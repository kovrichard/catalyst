import Image from "next/image";
import Link from "next/link";
import type React from "react";
import CatalystBadge from "@/components/footer/catalyst-badge";

// @catalyst:auth-start

import { headers } from "next/headers";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
// @catalyst:auth-end

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // @catalyst:auth-start
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  // @catalyst:auth-end

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
        {/* @catalyst:auth-start */}
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
        {/* @catalyst:auth-end */}
      </header>
      {children}
      <footer className="container flex w-full justify-start py-4">
        <CatalystBadge />
      </footer>
    </div>
  );
}

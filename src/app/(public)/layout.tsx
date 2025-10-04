import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { auth } from "@/auth";
import CatalystBadge from "@/components/footer/catalyst-badge";
import { Button } from "@/components/ui/button";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="flex flex-col flex-1 w-full">
      <header className="flex w-full py-4 gap-4 justify-end items-center container">
        <Link
          href="/"
          className="flex gap-2 items-center mr-auto font-medium text-lg whitespace-pre"
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
      <footer className="flex w-full py-4 justify-start container">
        <CatalystBadge />
      </footer>
    </div>
  );
}

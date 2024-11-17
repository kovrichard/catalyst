import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="flex flex-col flex-1 mx-auto max-w-7xl w-full">
      <header className="flex w-full p-4 gap-4 justify-end items-center">
        <Link
          href="/"
          className="flex gap-2 items-center mr-auto font-medium text-lg whitespace-pre"
        >
          <Image src="/icon.png" alt="Catalyst" width={30} height={30} />
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
      <footer className="flex w-full p-4 justify-start">
        <a
          href="https://catalyst.richardkovacs.dev"
          target="_blank"
          className="text-sm py-1 px-2 rounded flex items-center gap-1.5 shadow-md bg-card dark:bg-input border text-foreground hover:bg-input/50 transition-colors"
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
      </footer>
    </div>
  );
}

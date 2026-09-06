"use client";

import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import LastUsedIndicator from "@/components/auth/last-used-indicator";
import { Button } from "@/components/ui/button";

export default function OAuthButton({
  provider,
  title,
  isPending,
}: {
  provider: string;
  title: string;
  isPending?: boolean;
}) {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="relative flex w-full gap-2 border bg-white text-black hover:bg-gray-100"
      onClick={() => {
        localStorage.setItem("catalyst-auth-method", provider);
      }}
    >
      {isPending ? (
        <LoaderCircle
          className="pointer-events-none absolute left-3 animate-spin"
          size={20}
        />
      ) : null}
      <Image
        src={`/${provider}.svg`}
        width="20"
        height="20"
        alt={title}
        className="pointer-events-none"
      />
      <span className="pointer-events-none">{title}</span>
      <LastUsedIndicator provider={provider} />
    </Button>
  );
}

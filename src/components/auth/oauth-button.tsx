"use client";

import Image from "next/image";
import LastUsedIndicator from "@/components/auth/last-used-indicator";
import { Button } from "@/components/ui/button";

/**
 * Render a sign-in button for the given OAuth provider.
 *
 * The button displays the provider icon and title, and records the chosen provider to
 * localStorage when clicked.
 *
 * @param provider - Provider identifier used for the icon filename (e.g., `google`) and for persisting the selected auth method under the `catalyst-auth-method` key
 * @param title - Visible label for the button and the image alt text
 * @returns The button element that initiates provider selection and updates localStorage when activated
 */
export default function OAuthButton({
  provider,
  title,
}: {
  provider: string;
  title: string;
}) {
  return (
    <Button
      type="submit"
      className="relative flex w-full gap-2 border bg-white text-black hover:bg-gray-100"
      onClick={() => {
        localStorage.setItem("catalyst-auth-method", provider);
      }}
    >
      <Image
        src={`/${provider}.svg`}
        width="20"
        height="20"
        alt={title}
        className="pointer-events-none"
      />
      <span className="pointer-events-none">{title}</span>
      <LastUsedIndicator provider={provider} className="text-black sm:text-foreground" />
    </Button>
  );
}
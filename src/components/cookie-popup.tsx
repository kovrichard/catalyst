"use client";

import { Cookie } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: TODO: Need further investigation
    gtag?: (...args: any[]) => void;
  }
}

type Consent = "granted" | "denied";

/**
 * Cookie consent popup component that prompts users to accept or reject tracking cookies.
 *
 * Displays a dismissible UI after a short delay when the user has not previously responded.
 * Accepting or rejecting stores "cookie-popup-accepted" = "true" in localStorage, updates Google Analytics consent ("ga-consent") in localStorage, and—if available—calls `window.gtag("consent", "update", ...)` with the chosen consent values. The component uses entry and exit animations and waits for the exit animation to complete before hiding.
 *
 * @returns A React element rendering the cookie consent UI, or `null` when the popup is hidden.
 */
export default function CookiePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const updateConsent = (consent: Consent) => {
    localStorage.setItem("ga-consent", consent);
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: consent,
        ad_user_data: consent,
        ad_personalization: consent,
        analytics_storage: consent,
      });
    }

    // Wait for exit animation to complete before hiding
    setTimeout(() => {
      setIsOpen(false);
      setIsExiting(false);
    }, 300); // Match the exit animation duration
  };

  const handleAccept = () => {
    localStorage.setItem("cookie-popup-accepted", "true");
    setIsExiting(true);
    updateConsent("granted");
  };

  const handleReject = () => {
    localStorage.setItem("cookie-popup-accepted", "true");
    setIsExiting(true);
    updateConsent("denied");
  };

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-popup-accepted");
    if (accepted !== "true") {
      // Small delay to ensure smooth entry animation
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 z-50 max-w-[calc(100vw-2rem)] rounded-lg border bg-background p-4 shadow-lg sm:max-w-md",
        "cookie-popup-bottom",
        isExiting && "exiting"
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <Cookie />
        <h4 className="font-semibold">Cookie consent</h4>
      </div>
      <div className="mb-3 text-sm">
        <p>This website uses cookies to improve the user experience.</p>
      </div>
      <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
        <Button variant="link" asChild>
          <Link href="/privacy-policy">Read more</Link>
        </Button>
        <Button onClick={handleReject} variant="ghost" className="w-full border sm:w-28">
          Reject
        </Button>
        <Button onClick={handleAccept} className="w-full sm:w-28">
          Accept
        </Button>
      </div>
    </div>
  );
}
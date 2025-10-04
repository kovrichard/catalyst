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
        "fixed bottom-4 right-4 max-w-[calc(100vw-2rem)] bg-background p-4 rounded-lg shadow-lg border sm:max-w-md z-50",
        "cookie-popup-bottom",
        isExiting && "exiting"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Cookie />
        <h4 className="font-semibold">Cookie consent</h4>
      </div>
      <div className="text-sm mb-3">
        <p>This website uses cookies to improve the user experience.</p>
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
        <Button variant="link" asChild>
          <Link href="/privacy-policy">Read more</Link>
        </Button>
        <Button onClick={handleReject} variant="ghost" className="w-full sm:w-28 border">
          Reject
        </Button>
        <Button onClick={handleAccept} className="w-full sm:w-28">
          Accept
        </Button>
      </div>
    </div>
  );
}

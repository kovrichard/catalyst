"use client";

import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { usePublicConfig } from "@/lib/contexts/public-config-context";

async function conditionalUiAvailable(): Promise<boolean> {
  if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
    return false;
  }

  return Boolean(await PublicKeyCredential.isConditionalMediationAvailable?.());
}

export default function PasskeySignInButton() {
  const router = useRouter();
  const publicConf = usePublicConfig();
  const [isPending, setIsPending] = useState(false);

  const redirectPath = publicConf.redirectPath;

  const completeSignIn = useCallback(() => {
    localStorage.setItem("catalyst-auth-method", "passkey");
    router.push(redirectPath);
  }, [router, redirectPath]);

  // A browser only offers a stored passkey in the email field's autofill menu
  // while a conditional request is open, so one is armed for the page's lifetime.
  useEffect(() => {
    let cancelled = false;

    async function armConditionalUi() {
      if (!(await conditionalUiAvailable())) {
        return;
      }

      const result = await signIn.passkey({ autoFill: true });

      if (!cancelled && result && !result.error) {
        completeSignIn();
      }
    }

    void armConditionalUi();

    return () => {
      cancelled = true;
    };
  }, [completeSignIn]);

  async function handleClick() {
    setIsPending(true);
    const result = await signIn.passkey();

    if (result?.error) {
      toast("Passkey sign-in failed", {
        description: "No passkey was used, or it is not registered to this account.",
      });
      setIsPending(false);
      return;
    }

    completeSignIn();
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="flex w-full gap-2"
      onClick={handleClick}
      disabled={isPending}
    >
      <KeyRound size={16} />
      Sign in with a passkey
    </Button>
  );
}

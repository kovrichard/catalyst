"use client";

import { KeyRound, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { passkey } from "@/lib/auth-client";
import { formatTimeAgo } from "@/lib/utils";

export type PasskeySummary = {
  id: string;
  label: string;
  createdAt: Date;
};

// Ordered because these strings overlap: an iPhone reports "Mac" too, Edge and
// Opera both report "Chrome", and every Chromium browser reports "Safari".
const platformNames: [RegExp, string][] = [
  [/iPhone|iPad/, "iOS"],
  [/Android/, "Android"],
  [/Mac/, "macOS"],
  [/Windows/, "Windows"],
  [/Linux/, "Linux"],
];

const browserNames: [RegExp, string][] = [
  [/Edg/, "Edge"],
  [/OPR/, "Opera"],
  [/Chrome/, "Chrome"],
  [/Firefox/, "Firefox"],
  [/Safari/, "Safari"],
];

function firstMatch(names: [RegExp, string][], userAgent: string, fallback: string) {
  return names.find(([pattern]) => pattern.test(userAgent))?.[1] ?? fallback;
}

// Used only when the authenticator reports no recognisable AAGUID — Apple zeroes
// it under the default attestation, so those passkeys need a device label instead.
export function deviceLabel(userAgent: string): string {
  const browser = firstMatch(browserNames, userAgent, "Browser");
  const platform = firstMatch(platformNames, userAgent, "this device");

  return `${browser} on ${platform}`;
}

export default function PasskeysCard({ passkeys }: { passkeys: PasskeySummary[] }) {
  const router = useRouter();
  const [isWorking, setIsWorking] = useState(false);

  async function addPasskey() {
    setIsWorking(true);
    const result = await passkey.addPasskey({ name: deviceLabel(navigator.userAgent) });
    setIsWorking(false);

    if (result?.error) {
      toast("Could not add a passkey", {
        description: "The request was dismissed or the device is not supported.",
      });
      return;
    }

    toast("Passkey added", { description: "You can now sign in without a password." });
    router.refresh();
  }

  async function removePasskey(id: string) {
    setIsWorking(true);
    const result = await passkey.deletePasskey({ id });
    setIsWorking(false);

    if (result?.error) {
      toast("Could not remove the passkey", { description: "Please try again." });
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:p-5">
      <p className="text-muted-foreground text-sm">
        Sign in with your fingerprint, face, or device PIN instead of a password.
      </p>

      {passkeys.length === 0 ? (
        <p className="text-muted-foreground text-sm">No passkeys yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {passkeys.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
            >
              <span className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2 text-sm">
                  <KeyRound size={16} className="text-muted-foreground" />
                  {entry.label}
                </span>
                <span className="pl-6 text-muted-foreground text-xs">
                  added {formatTimeAgo(entry.createdAt)}
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${entry.label}`}
                disabled={isWorking}
                onClick={() => removePasskey(entry.id)}
              >
                <Trash2 size={16} />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        variant="outline"
        className="self-start"
        disabled={isWorking}
        onClick={addPasskey}
      >
        Add a passkey
      </Button>
    </div>
  );
}

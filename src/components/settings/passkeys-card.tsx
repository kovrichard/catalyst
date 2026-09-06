"use client";

import { KeyRound, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { passkey } from "@/lib/auth-client";

export type PasskeySummary = {
  id: string;
  name?: string | null;
  createdAt: Date;
};

export default function PasskeysCard({ passkeys }: { passkeys: PasskeySummary[] }) {
  const router = useRouter();
  const [isWorking, setIsWorking] = useState(false);

  async function addPasskey() {
    setIsWorking(true);
    const result = await passkey.addPasskey({
      name: `Passkey ${passkeys.length + 1}`,
    });
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
              <span className="flex items-center gap-2 text-sm">
                <KeyRound size={16} className="text-muted-foreground" />
                {entry.name || "Passkey"}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${entry.name || "passkey"}`}
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

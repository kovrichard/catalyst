"use client";

import { KeyRound } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { revokeApiKey } from "@/lib/actions/api-keys";
import { formatTimeAgo } from "@/lib/utils";
import type { ApiKeySummary } from "@/types/api-key";

function lastUsedLabel(apiKey: ApiKeySummary) {
  if (!apiKey.lastRequest) return "never used";
  return `last used ${formatTimeAgo(apiKey.lastRequest)}`;
}

export default function ApiKeysList({ apiKeys }: { apiKeys: ApiKeySummary[] }) {
  const [revokeTarget, setRevokeTarget] = useState<ApiKeySummary | null>(null);
  const [isRevoking, startRevoke] = useTransition();

  function confirmRevoke() {
    const target = revokeTarget;
    if (!target) return;

    setRevokeTarget(null);
    startRevoke(async () => {
      const result = await revokeApiKey(target.id);
      toast(result.message, { description: result.description });
    });
  }

  if (apiKeys.length === 0) {
    return (
      <p className="py-2 text-center text-muted-foreground text-sm">
        You have no API keys yet.
      </p>
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-2">
        {apiKeys.map((apiKey) => (
          <li
            key={apiKey.id}
            className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
          >
            <KeyRound className="size-4 shrink-0 text-muted-foreground" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-medium text-sm">
                {apiKey.name ?? "Unnamed key"}
              </span>
              <span className="truncate text-muted-foreground text-xs">
                {apiKey.start ? `${apiKey.start}… · ` : ""}
                {lastUsedLabel(apiKey)}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isRevoking}
              onClick={() => setRevokeTarget(apiKey)}
            >
              Revoke
            </Button>
          </li>
        ))}
      </ul>

      <AlertDialog
        open={revokeTarget !== null}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-left">Revoke this key?</AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Any agent using “{revokeTarget?.name ?? "this key"}” loses access
              immediately. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row items-center justify-end gap-2">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <Button type="button" variant="destructive" onClick={confirmRevoke}>
              Revoke
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

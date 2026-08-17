"use client";

import { KeyRound } from "lucide-react";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import ApiKeyCreatedModal from "@/components/settings/api-key-created-modal";
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
import { Input } from "@/components/ui/input";
import useToast from "@/hooks/use-toast";
import {
  type CreateApiKeyState,
  createApiKey,
  revokeApiKey,
} from "@/lib/actions/api-keys";
import { formatTimeAgo } from "@/lib/utils";
import type { ApiKeySummary } from "@/types/api-key";

const initialCreateState: CreateApiKeyState = {
  message: "",
  description: "",
  success: undefined,
};

function lastUsedLabel(apiKey: ApiKeySummary) {
  if (!apiKey.lastRequest) return "never used";
  return `last used ${formatTimeAgo(apiKey.lastRequest)}`;
}

export default function ApiKeysCard({ apiKeys }: { apiKeys: ApiKeySummary[] }) {
  const [createState, createAction, isCreating] = useActionState(
    createApiKey,
    initialCreateState
  );
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<ApiKeySummary | null>(null);
  const [isRevoking, startRevoke] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useToast(createState);

  useEffect(() => {
    if (!createState.key) return;
    setRevealedKey(createState.key);
    formRef.current?.reset();
  }, [createState.key]);

  function confirmRevoke() {
    const target = revokeTarget;
    if (!target) return;

    setRevokeTarget(null);
    startRevoke(async () => {
      const result = await revokeApiKey(target.id);
      toast(result.message, { description: result.description });
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-1">
        <h4 className="font-semibold text-lg">API Keys</h4>
        <p className="text-muted-foreground text-sm">
          Give an agent read-only access to your data over MCP.
        </p>
      </div>

      <form ref={formRef} action={createAction} className="flex items-center gap-2">
        <Input name="name" placeholder="Key name, e.g. Claude Code" maxLength={64} />
        <Button type="submit" disabled={isCreating}>
          Create
        </Button>
      </form>

      {apiKeys.length === 0 ? (
        <p className="py-2 text-center text-muted-foreground text-sm">
          You have no API keys yet.
        </p>
      ) : (
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
      )}

      <ApiKeyCreatedModal apiKey={revealedKey} onClose={() => setRevealedKey(null)} />

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
    </div>
  );
}

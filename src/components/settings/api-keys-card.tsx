"use client";

import { type ReactNode, useActionState, useEffect, useRef, useState } from "react";
import ApiKeyCreatedModal from "@/components/settings/api-key-created-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useToast from "@/hooks/use-toast";
import { type CreateApiKeyState, createApiKey } from "@/lib/actions/api-keys";

const initialCreateState: CreateApiKeyState = {
  message: "",
  description: "",
  success: undefined,
};

export default function ApiKeysCard({ children }: { children: ReactNode }) {
  const [createState, createAction, isCreating] = useActionState(
    createApiKey,
    initialCreateState
  );
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useToast(createState);

  useEffect(() => {
    if (!createState.key) return;
    setRevealedKey(createState.key);
    formRef.current?.reset();
  }, [createState.key]);

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

      {children}

      <ApiKeyCreatedModal apiKey={revealedKey} onClose={() => setRevealedKey(null)} />
    </div>
  );
}

"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/responsive-modal";

const copiedResetDelay = 2000;

export default function ApiKeyCreatedModal({
  apiKey,
  onClose,
}: {
  apiKey: string | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copyKey() {
    if (!apiKey) return;

    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), copiedResetDelay);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setCopied(false);
      onClose();
    }
  }

  return (
    <Modal open={apiKey !== null} onOpenChange={handleOpenChange}>
      <ModalContent>
        <ModalHeader className="text-left">
          <ModalTitle className="text-left">Your new API key</ModalTitle>
          <ModalDescription className="text-left">
            This is the only time the key is shown. Store it somewhere safe before closing
            this dialog.
          </ModalDescription>
        </ModalHeader>
        <div className="flex items-center gap-2 rounded-lg border bg-muted p-3">
          <code className="min-w-0 flex-1 break-all font-mono text-xs">{apiKey}</code>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Copy API key"
            onClick={() => void copyKey()}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </Button>
        </div>
        <ModalFooter>
          <Button type="button" onClick={() => handleOpenChange(false)}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

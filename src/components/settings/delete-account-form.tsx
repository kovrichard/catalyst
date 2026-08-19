"use client";

import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/responsive-modal";
import useToast from "@/hooks/use-toast";
import { deleteUser } from "@/lib/actions/users";
import { signOut } from "@/lib/auth-client";
import { type FormState, initialState } from "@/lib/utils";

const CONFIRM_PHRASE = "delete my account";

export default function DeleteAccountForm() {
  const [state, formAction] = useActionState(deleteUser, initialState);
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const confirmFieldId = useId();
  const isConfirmed = confirmText === CONFIRM_PHRASE;
  const router = useRouter();

  function handleOpenChange(open: boolean) {
    setOpen(open);
    if (!open) {
      setConfirmText("");
    }
  }

  const successCallback = async (state: FormState) => {
    if (state.success) {
      setOpen(false);
      setTimeout(() => {
        void signOut().then(() => {
          router.push("/login");
        });
      }, 2000);
    }
  };

  useToast(state, successCallback);

  return (
    <div className="flex gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 sm:p-5">
      <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="font-medium text-sm">Delete your account</span>
        <p className="text-muted-foreground text-sm">
          Your sites, tests and every measurement they collected go with it. There is no
          way to get them back.
        </p>
        <Modal onOpenChange={handleOpenChange} open={open}>
          <ModalTrigger asChild>
            <Button className="mt-3 w-fit" type="button" variant="destructive">
              Delete my account
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Delete your account?</ModalTitle>
              <ModalDescription>
                Your sites, tests and every measurement they collected are deleted with
                it, and none of it can be recovered.
              </ModalDescription>
            </ModalHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor={confirmFieldId}>
                Type <span className="font-mono">{CONFIRM_PHRASE}</span> to confirm
              </Label>
              <Input
                autoComplete="off"
                id={confirmFieldId}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={CONFIRM_PHRASE}
                value={confirmText}
              />
            </div>
            <ModalFooter>
              <Button
                onClick={() => handleOpenChange(false)}
                type="button"
                variant="outline"
              >
                Keep it
              </Button>
              <form action={formAction} className="w-full sm:w-auto">
                <Button
                  className="w-full"
                  disabled={!isConfirmed}
                  type="submit"
                  variant="destructive"
                >
                  Delete permanently
                </Button>
              </form>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

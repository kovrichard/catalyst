"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useToast from "@/hooks/use-toast";
import { deleteUser } from "@/lib/actions/users";
import { signOut } from "@/lib/auth-client";
import { type FormState, initialState } from "@/lib/utils";

export default function DeleteAccountForm() {
  const [state, formAction] = useActionState(deleteUser, initialState);
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const isConfirmed = confirmText === "delete my account";
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
      setTimeout(async () => {
        await signOut();
        router.push("/login");
      }, 2000);
    }
  };

  useToast(state, successCallback);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
      <h4 className="font-semibold text-lg">Delete Account</h4>
      <p className="text-sm">
        This action is irreversible. All your data will be permanently deleted.
      </p>
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="destructive" className="mt-2 w-fit self-end">
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-left">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              <span className="block font-medium text-red-600 dark:text-red-400">
                Warning: This action cannot be undone.
              </span>
              <span className="mt-4 block">
                <span className="mb-2 block font-medium text-sm">
                  For security, please type 'delete my account' to proceed:
                </span>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="delete my account"
                />
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row items-center justify-end gap-2">
            <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
            <form action={formAction}>
              <Button type="submit" variant="destructive" disabled={!isConfirmed}>
                Delete Account
              </Button>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

"use client";

import { signOut } from "next-auth/react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import useToast from "@/hooks/use-toast";
import { deleteUserAction } from "@/lib/actions/users";
import { type FormState, initialState } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

/**
 * Renders a "Delete Account" form with a confirmation dialog and server-backed delete action.
 *
 * On successful deletion the dialog is closed and the user is signed out after a 2-second delay.
 *
 * @returns A React element containing the delete-account UI and confirmation dialog
 */
export default function DeleteAccountForm() {
  const [state, formAction] = useActionState(deleteUserAction, initialState);
  const [open, setOpen] = useState(false);

  const successCallback = async (state: FormState) => {
    if (state.success) {
      setOpen(false);
      setTimeout(() => {
        signOut();
      }, 2000);
    }
  };

  useToast(state, successCallback);

  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-semibold text-lg">Delete Account</h4>
      <p className="text-muted-foreground text-sm">
        This action is irreversible. All your data will be permanently deleted.
      </p>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button type="submit" variant="destructive" className="w-fit">
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. All your data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={formAction}>
              <Button type="submit">Delete</Button>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import useToast from "@/hooks/use-toast";
import { deleteUser } from "@/lib/actions/users";
import { FormState, initialState } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useActionState } from "react";
import { useState } from "react";
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

export default function DeleteAccountForm() {
  const [state, formAction] = useActionState(deleteUser, initialState);
  const [open, setOpen] = useState(false);

  const successCallback = async (state: FormState) => {
    if (state.message === "User deleted") {
      setOpen(false);
      setTimeout(() => {
        signOut();
      }, 2000);
    }
  };

  useToast(state, successCallback);

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-lg font-semibold">Delete Account</h4>
      <p className="text-sm text-muted-foreground">
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

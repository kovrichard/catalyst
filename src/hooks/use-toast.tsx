"use client";

import { FormState } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

const useToast = (
  state: FormState,
  callback: ((state: FormState) => void) | undefined = undefined
) => {
  useEffect(() => {
    if (!state.message) return;

    toast(state.message, {
      description: state.description,
      action: {
        label: "OK",
        onClick: () => {
          toast.dismiss();
        },
      },
    });

    if (callback) {
      callback(state);
    }
  }, [state]);
};

export default useToast;

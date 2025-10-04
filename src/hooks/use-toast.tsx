"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { FormState } from "@/lib/utils";

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
  }, [state, callback]);
};

export default useToast;

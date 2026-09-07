"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { FormState } from "@/lib/utils";

const useToast = (state: FormState, callback?: (state: FormState) => void) => {
  const latestCallback = useRef(callback);

  useEffect(() => {
    latestCallback.current = callback;
  });

  // Callers pass an inline arrow, so depending on the callback's identity would
  // re-run this on every render — re-toasting and re-resetting Turnstile on each
  // keystroke after a failed submit.
  useEffect(() => {
    if (!state.message) {
      return;
    }

    toast(state.message, {
      description: state.description,
      action: {
        label: "OK",
        onClick: () => {
          toast.dismiss();
        },
      },
    });

    latestCallback.current?.(state);
  }, [state]);
};

export default useToast;

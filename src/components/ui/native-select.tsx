import type * as React from "react";

import { cn } from "@/lib/utils";

function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-11 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs md:h-9",
        className
      )}
      data-slot="native-select"
      {...props}
    />
  );
}

export { NativeSelect };

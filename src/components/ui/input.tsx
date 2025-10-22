import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Render a styled input element with configurable attributes and additional CSS classes.
 *
 * @param className - Additional class names appended to the component's default styling
 * @param type - HTML input `type` attribute (for example `"text"`, `"password"`, `"email"`)
 * @returns The rendered input element
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Input };
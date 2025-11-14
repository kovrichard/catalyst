"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type * as React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Renders styled tooltip content for use inside a Tooltip.
 *
 * Merges the provided `className` with the component's default styling, applies `sideOffset`, and forwards remaining props to the underlying TooltipPrimitive.Content.
 *
 * @param className - Additional CSS class names to apply to the content
 * @param sideOffset - Distance in pixels between the trigger and the tooltip content (default: 4)
 * @returns The rendered TooltipPrimitive.Content element
 */
function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Content
      data-slot="tooltip-content"
      sideOffset={sideOffset}
      className={cn(
        "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 animate-in overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-popover-foreground text-sm shadow-md data-[state=closed]:animate-out",
        className
      )}
      {...props}
    />
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
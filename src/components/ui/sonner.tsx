"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          fontFamily: "inherit",
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--normal-bg-hover": "var(--accent)",
          "--normal-border-hover": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "text-sm! gap-2!",
          description: "text-muted-foreground!",
          actionButton:
            "bg-primary! text-primary-foreground! rounded-md! h-7! px-2.5! font-medium!",
          cancelButton: "bg-muted! text-muted-foreground! rounded-md! h-7! px-2.5!",
          closeButton:
            "bg-popover! text-muted-foreground! border-border! hover:text-foreground!",
          success:
            "[&_[data-icon]]:text-emerald-600 dark:[&_[data-icon]]:text-emerald-400",
          error: "[&_[data-icon]]:text-destructive",
          warning: "[&_[data-icon]]:text-amber-600 dark:[&_[data-icon]]:text-amber-400",
          info: "[&_[data-icon]]:text-primary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

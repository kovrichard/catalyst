import { Bell } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotificationMenuSkeleton() {
  return (
    <span
      aria-hidden
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative rounded-full text-muted-foreground"
      )}
    >
      <Bell size={22} />
    </span>
  );
}

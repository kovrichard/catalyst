import { LoaderCircle } from "lucide-react";
import LastUsedIndicator from "@/components/auth/last-used-indicator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PendingSubmitButton({
  isPending,
  text,
  className,
  disabled,
  ...props
}: Readonly<
  React.ComponentProps<typeof Button> & {
    isPending: boolean;
    text: string;
  }
>) {
  return (
    <Button
      disabled={isPending || disabled}
      className={cn("relative", className)}
      {...props}
    >
      {isPending ? <LoaderCircle className="animate-spin" size={18} /> : text}
      <LastUsedIndicator provider="password" className="text-white sm:text-foreground" />
    </Button>
  );
}

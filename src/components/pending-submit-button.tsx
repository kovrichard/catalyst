import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PendingSubmitButton({
  isPending,
  text,
  className,
  disabled,
  children,
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
      {children}
    </Button>
  );
}

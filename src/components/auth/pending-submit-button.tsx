import LastUsedIndicator from "@/components/auth/last-used-indicator";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export default function PendingSubmitButton({
  isPending,
  text,
  className,
  ...props
}: Readonly<
  ButtonProps & {
    isPending: boolean;
    text: string;
  }
>) {
  return (
    <Button disabled={isPending} className={cn("relative", className)} {...props}>
      {isPending ? <LoaderCircle className="animate-spin" size={18} /> : text}
      <LastUsedIndicator provider="password" />
    </Button>
  );
}

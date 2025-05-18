import { Button, ButtonProps } from "@/components/ui/button";
import { IconLoader2 } from "@tabler/icons-react";

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
    <Button disabled={isPending} className={className} {...props}>
      {isPending ? <IconLoader2 className="animate-spin" size={18} /> : text}
    </Button>
  );
}

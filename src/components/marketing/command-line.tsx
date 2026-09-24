import { CopyButton } from "./copy-button";
import { mono } from "./fonts";

export function CommandLine({
  command,
  copyable = false,
}: {
  command: string;
  copyable?: boolean;
}) {
  return (
    <div
      className={`${mono.className} flex h-12 w-fit max-w-full shrink-0 items-center gap-3 rounded-lg border bg-background/70 text-foreground text-sm md:h-10 ${copyable ? "pr-3 pl-4 md:pr-2" : "px-4"}`}
    >
      <span className="text-muted-foreground/60">$</span>
      <span className="min-w-0 truncate">{command}</span>
      {copyable ? <CopyButton text={command} /> : null}
    </div>
  );
}

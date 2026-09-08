import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mono } from "./fonts";

const REPO_URL = "https://github.com/kovrichard/catalyst";

export function Hero() {
  return (
    <section className="flex min-h-[100svh] w-full items-center justify-center">
      <div className="container flex flex-col items-center gap-8 py-24 text-center lg:py-32">
        <p
          className={`${mono.className} text-muted-foreground text-xs uppercase tracking-[0.2em]`}
        >
          After every agent turn
        </p>

        <h1 className="max-w-3xl bg-linear-to-r bg-position-[0%_0%] bg-size-[200%_100%] from-50% from-foreground to-50% to-muted-foreground bg-clip-text font-semibold text-5xl text-transparent leading-[1.02] tracking-tight lg:text-7xl">
          Every agent turn, checked in seconds.
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          Claude Code, Cursor, Codex or OpenCode hands back a diff. Eight checks run
          before you see it.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Button asChild>
            <Link href={REPO_URL}>Clone the repo</Link>
          </Button>
          <Link
            href="#pipeline"
            className="font-medium underline-offset-4 hover:underline"
          >
            See how it works →
          </Link>
        </div>

        <p className={`${mono.className} text-muted-foreground text-sm`}>
          8 checks · ~2.3s · on every turn
        </p>
      </div>
    </section>
  );
}

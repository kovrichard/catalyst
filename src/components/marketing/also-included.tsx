import Link from "next/link";
import { Button } from "@/components/ui/button";
import { display } from "@/lib/fonts";
import { REPO_URL } from "@/lib/repo";
import { mono } from "./fonts";

export function FinalCta() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-glow-cta" />
      <div className="container relative flex flex-col items-start gap-6 py-28">
        <h2
          className={`${display.className} max-w-2xl font-bold text-4xl tracking-tight md:text-5xl`}
        >
          Stop reviewing the small stuff.
        </h2>
        <p className="max-w-xl text-lg text-muted-foreground">
          Clone it, run bun dev, and let the hooks catch what you used to catch by hand.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href={REPO_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg">Clone the repo</Button>
          </Link>
          <code
            className={`${mono.className} rounded-lg border bg-card/60 px-4 py-2.5 text-muted-foreground text-sm`}
          >
            git clone {REPO_URL}.git
          </code>
        </div>
      </div>
    </section>
  );
}

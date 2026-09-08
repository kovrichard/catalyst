import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mono } from "./fonts";

const REPO_URL = "https://github.com/kovrichard/catalyst";

export function Hero() {
  return (
    <section className="flex min-h-[100svh] w-full items-center justify-center">
      <div className="container flex flex-col items-center gap-8 py-24 text-center lg:py-32">
        <p
          className={`${mono.className} text-balance text-muted-foreground text-xs uppercase tracking-[0.2em]`}
        >
          The Next.js starter for building with AI
        </p>

        <h1 className="max-w-3xl text-balance font-semibold text-[clamp(2rem,8.2vw,3.75rem)] leading-[1.05] tracking-tight lg:text-6xl">
          Build your product.
          <br />
          <span className="text-muted-foreground">Not your setup.</span>
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          Catalyst brings together a full-stack app foundation, coding-agent workflows,
          and automated quality checks. Start with the essentials connected and
          architectural rules in place, then focus on what makes your product yours.
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

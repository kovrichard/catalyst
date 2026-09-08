import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { display } from "@/lib/fonts";
import { mono } from "./fonts";

const REPO_URL = "https://github.com/kovrichard/catalyst";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-var(--spacing-header))] w-full items-center justify-center">
      <div className="container flex animate-hero-reveal flex-col items-center gap-8 py-16 text-center will-change-[transform,opacity]">
        <p
          className={`${mono.className} text-balance text-muted-foreground text-xs uppercase tracking-[0.2em]`}
        >
          The Next.js starter for building with AI
        </p>

        <h1
          className={`${display.className} max-w-3xl text-balance font-bold text-[clamp(2rem,8.2vw,3.75rem)] leading-[1.05] tracking-tight lg:text-7xl`}
        >
          Build your product.
          <br />
          <span className="text-muted-foreground">Not your setup.</span>
        </h1>

        <p className="max-w-xl text-balance text-lg text-muted-foreground">
          Every starter kit hands you auth and payments. This one also hands your agent
          the rules that keep them intact.
        </p>

        <Button asChild size="lg">
          <Link href={REPO_URL}>Clone the repo</Link>
        </Button>
      </div>

      <Link
        href="#pipeline"
        aria-label="Skip to what Catalyst includes"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-hero-caret text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronDown className="size-6 motion-safe:animate-bounce" />
      </Link>
    </section>
  );
}

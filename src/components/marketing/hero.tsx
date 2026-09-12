import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { display } from "@/lib/fonts";
import { REPO_URL } from "@/lib/repo";
import { meteorMask } from "@/lib/utils/meteor-mask";
import { mono } from "./fonts";

export function Hero() {
  return (
    <div className="relative flex h-full w-full animate-hero-zoom items-center justify-center will-change-[transform,opacity]">
      <div className="container flex animate-hero-reveal flex-col items-center gap-8 text-center will-change-[transform,opacity]">
        <span
          aria-hidden="true"
          className="size-20 shrink-0 bg-current"
          style={meteorMask}
        />

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
    </div>
  );
}

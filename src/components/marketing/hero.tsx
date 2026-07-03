import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mono } from "./fonts";

const REPO_URL = "https://github.com/kovrichard/catalyst";

const STACK = [
  "Next.js",
  "Bun",
  "TypeScript",
  "tRPC",
  "Prisma",
  "PostgreSQL",
  "Better Auth",
  "Stripe",
  "Tailwind",
  "shadcn/ui",
];

const TERMINAL = [
  { id: "path", text: "~/app on ⎇ main", className: "text-muted-foreground" },
  { id: "prompt", text: '$ claude "add a pricing card"', className: "text-foreground" },
  { id: "gap1", text: " ", className: "" },
  {
    id: "edit1",
    text: "● edited  src/components/pricing-card.tsx",
    className: "text-foreground/70",
  },
  {
    id: "edit2",
    text: "● edited  src/lib/stripe/prices.ts",
    className: "text-foreground/70",
  },
  { id: "gap2", text: " ", className: "" },
  { id: "run", text: "running stop hook · 7 checks", className: "text-muted-foreground" },
  { id: "gap3", text: " ", className: "" },
  {
    id: "check",
    text: "✓ check       biome          42ms",
    className: "text-emerald-500",
  },
  {
    id: "types",
    text: "✓ type-check  tsc            1.2s",
    className: "text-emerald-500",
  },
  {
    id: "knip",
    text: "✓ knip        unused-exports 380ms",
    className: "text-emerald-500",
  },
  {
    id: "jscpd",
    text: "✓ jscpd       duplication    118ms",
    className: "text-emerald-500",
  },
  {
    id: "klint",
    text: "✓ klint       architecture   90ms",
    className: "text-emerald-500",
  },
  {
    id: "madge",
    text: "✓ madge       cycles         204ms",
    className: "text-emerald-500",
  },
  { id: "lf", text: "✓ lf          line-endings   12ms", className: "text-emerald-500" },
  { id: "gap4", text: " ", className: "" },
  {
    id: "summary",
    text: "✓ 7/7 passed · 0 issues · ready to review",
    className: "font-semibold text-emerald-400",
  },
];

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-glow" />

      <div className="container relative grid grid-cols-1 items-center gap-14 py-20 lg:grid-cols-2 lg:gap-10 lg:py-28">
        <div className="flex flex-col items-start gap-6">
          <span
            className={`${mono.className} inline-flex items-center gap-2 rounded-full border px-3 py-1 text-muted-foreground text-xs`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            agentic next.js boilerplate
          </span>

          <h1
            className={`${mono.className} font-bold text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl`}
          >
            Code review for
            <br />
            <span className="text-emerald-500">your AI agent.</span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            Catalyst is a Next.js boilerplate that runs seven checks after every Claude
            Code, Cursor, Codex, or OpenCode turn. Broken lint, types, dead code,
            duplication, and architecture get caught and fixed before the diff ever
            reaches you.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg">Clone the repo</Button>
            </Link>
            <Link href="#pipeline">
              <Button size="lg" variant="outline">
                See how it works
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {STACK.map((tool) => (
              <Badge
                key={tool}
                variant="outline"
                className={`${mono.className} text-muted-foreground text-xs`}
              >
                {tool}
              </Badge>
            ))}
          </div>
        </div>

        <div
          className={`${mono.className} relative overflow-hidden rounded-xl border bg-card/70 shadow-2xl backdrop-blur`}
        >
          <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-2 text-muted-foreground text-xs">
              agent session · stop hook
            </span>
          </div>
          <div className="overflow-x-auto p-4 text-sm leading-relaxed">
            {TERMINAL.map((line, index) => (
              <p
                key={line.id}
                className={`fade-in-0 slide-in-from-bottom-1 animate-in whitespace-pre fill-mode-both duration-500 ${line.className}`}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                {line.text}
              </p>
            ))}
            <span className="mt-1 inline-block h-4 w-2 animate-blink bg-emerald-500 align-middle" />
          </div>
        </div>
      </div>
    </section>
  );
}

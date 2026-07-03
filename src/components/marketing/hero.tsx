import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const REPO_URL = "https://github.com/kovrichard/catalyst";

const STACK = [
  "Next.js",
  "Bun",
  "TypeScript",
  "tRPC",
  "Prisma",
  "PostgreSQL",
  "Better Auth",
  "Tailwind CSS",
  "shadcn/ui",
];

const TERMINAL_LINES = [
  { text: "$ claude", className: "text-muted-foreground" },
  { text: "> edited src/components/pricing-card.tsx", className: "text-foreground" },
  { text: "⠋ running stop hooks…", className: "text-muted-foreground" },
  {
    text: "✓ lint · types · knip · jscpd · klint · madge · lf",
    className: "text-emerald-500",
  },
  { text: "  all clear, 0 issues", className: "text-muted-foreground" },
];

export function Hero() {
  return (
    <section className="w-full">
      <div className="container grid grid-cols-1 items-center gap-12 py-24 lg:grid-cols-[3fr_2fr] lg:py-32">
        <div className="flex max-w-3xl flex-col items-start gap-6 text-left">
          <Badge variant="outline" className="gap-2 font-mono text-xs tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            agentic next.js boilerplate
          </Badge>

          <h1 className="font-mono font-semibold text-4xl tracking-tight md:text-5xl">
            <span className="block text-foreground">$ ship code</span>
            <span className="mt-1 block text-muted-foreground">
              your agent already verified
            </span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            Catalyst wires Claude Code, Cursor, Codex, and OpenCode into the same
            seven-check pipeline (lint, types, dead code, duplication, architecture,
            circular imports, line endings), so broken edits get caught before they reach
            your review queue. Auth, database, and payments are already wired in.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg">View on GitHub</Button>
            </Link>
            <Link href="#hooks">
              <Button size="lg" variant="outline">
                See the 7 checks
              </Button>
            </Link>
          </div>

          <pre className="w-full max-w-md overflow-x-auto rounded-lg border bg-muted/40 px-4 py-3 font-mono text-sm">
            <code>
              $ git clone {REPO_URL}.git{"\n"}$ bun install &amp;&amp; bun dev
            </code>
          </pre>

          <div className="flex flex-wrap gap-2 pt-2">
            {STACK.map((tool) => (
              <Badge key={tool} variant="outline" className="font-mono text-xs">
                {tool}
              </Badge>
            ))}
          </div>
        </div>

        <div className="hidden rounded-lg border bg-muted/30 p-5 font-mono text-sm shadow-sm lg:block">
          <div className="mb-3 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="flex flex-col gap-1.5">
            {TERMINAL_LINES.map((line, index) => (
              <p
                key={line.text}
                className={`fade-in-0 slide-in-from-bottom-2 animate-in fill-mode-both duration-500 ${line.className}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {line.text}
              </p>
            ))}
            <span className="animate-blink text-emerald-500">_</span>
          </div>
        </div>
      </div>
    </section>
  );
}

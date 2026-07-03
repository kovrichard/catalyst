import {
  Container,
  CreditCard,
  Database,
  Mail,
  ScrollText,
  ShieldCheck,
  Waypoints,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mono } from "./fonts";

const REPO_URL = "https://github.com/kovrichard/catalyst";

const STOCK = [
  {
    icon: ShieldCheck,
    title: "Better Auth",
    desc: "Email and OAuth sessions, login, register, and password reset already built.",
  },
  {
    icon: Database,
    title: "Prisma + PostgreSQL",
    desc: "A typed data layer with migrations and a clean DAO pattern.",
  },
  {
    icon: Waypoints,
    title: "tRPC + React Query",
    desc: "End-to-end typed API calls with a cache persisted to IndexedDB.",
  },
  {
    icon: CreditCard,
    title: "Stripe",
    desc: "Webhook handling wired in, ready for when you add checkout.",
  },
  {
    icon: Mail,
    title: "React Email + SES",
    desc: "Transactional emails authored in JSX and sent through Amazon SES.",
  },
  {
    icon: ScrollText,
    title: "Winston logging",
    desc: "Structured logs with levels, ready to point at a drain.",
  },
  {
    icon: Wrench,
    title: "Biome + Husky",
    desc: "Formatting, linting, and pre-commit hooks configured from line one.",
  },
  {
    icon: Container,
    title: "Docker + devcontainer",
    desc: "Postgres, Redis, and the app in one command, plus an agent container.",
  },
];

export function AlsoIncluded() {
  return (
    <section className="w-full border-b">
      <div className="container flex flex-col gap-10 py-24">
        <div className="flex max-w-2xl flex-col gap-3">
          <p
            className={`${mono.className} flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            stock
          </p>
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
            Everything else is already wired.
          </h2>
          <p className="text-lg text-muted-foreground">
            The verification layer is the new part. The rest is the boring, essential
            plumbing you'd otherwise spend a week assembling.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STOCK.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col gap-2 rounded-xl border bg-card/40 p-5"
              >
                <Icon className="h-5 w-5 text-emerald-500" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-glow" />
      <div className="container relative flex flex-col items-start gap-6 py-28">
        <h2 className="max-w-2xl font-bold text-4xl tracking-tight md:text-5xl">
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

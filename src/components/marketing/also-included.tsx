import { Code2, FileCode, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const REPO_URL = "https://github.com/kovrichard/catalyst";

const ITEMS = [
  {
    icon: Code2,
    title: "Type-safe end to end",
    description:
      "TypeScript, tRPC, Zod, and Prisma share one source of truth from database to client.",
  },
  {
    icon: Zap,
    title: "Auth and data, not just UI",
    description:
      "Better Auth for sessions, Prisma/PostgreSQL for storage, Stripe webhooks wired in for when you're ready to charge.",
  },
  {
    icon: FileCode,
    title: "Tooling that stays out of your way",
    description:
      "Biome, Husky, and the same hook pipeline shown above, pre-wired so day one looks like day 100.",
  },
];

export function AlsoIncluded() {
  return (
    <section className="w-full border-t">
      <div className="container flex flex-col gap-16 py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex flex-col gap-2">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-start gap-4 border-t pt-12">
          <h2 className="font-bold text-2xl tracking-tight md:text-3xl">
            Stop reviewing the small stuff.
          </h2>
          <p className="max-w-lg text-muted-foreground">
            Clone it, run it, and let the hooks catch what you used to.
          </p>
          <Link href={REPO_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg">Get started on GitHub</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Badge } from "@/components/ui/badge";

const HOOKS = [
  {
    name: "check",
    description: "Biome lint + format, so style nits never reach your diff.",
  },
  {
    name: "type-check",
    description: "tsc --noEmit, so a red squiggly never ships.",
  },
  {
    name: "knip",
    description: "Flags unused exports, files, and dependencies the agent left behind.",
  },
  {
    name: "jscpd",
    description:
      "Catches duplicated code. On failure, the agent is told to refactor, not raise the threshold.",
  },
  {
    name: "klint",
    description:
      "A custom architecture linter enforcing this repo's own layering rules, not generic best practices.",
  },
  {
    name: "madge",
    description: "Circular-import detection, before it becomes a build-time mystery.",
  },
  {
    name: "lf",
    description: "Enforces LF line endings, so git diff stays clean across OSes.",
  },
];

const AGENTS = ["Claude Code", "Cursor", "Codex", "OpenCode"];

function HookRow({
  name,
  description,
  index,
}: {
  name: string;
  description: string;
  index: number;
}) {
  return (
    <li
      className="fade-in-0 slide-in-from-bottom-2 grid animate-in grid-cols-[auto_7rem_1fr] items-baseline gap-4 border-b fill-mode-both py-3 duration-500 last:border-0"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className="text-emerald-500">✓</span>
      <span className="font-mono text-sm">{name}</span>
      <span className="text-muted-foreground text-sm">{description}</span>
    </li>
  );
}

export function HookChecklist() {
  return (
    <section id="hooks" className="w-full border-t bg-muted/20">
      <div className="container flex flex-col gap-8 py-24">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="flex items-center gap-2 font-mono text-muted-foreground text-xs uppercase tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            the stop hook: runs after every agent turn, before you review the diff
          </p>
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
            Every agent edit gets a code review before you do.
          </h2>
          <p className="text-lg text-muted-foreground">
            When Claude Code (or Cursor, Codex, OpenCode) finishes a turn, one runner
            fires seven checks. Fail one, and the agent sees the failure and fixes it
            before it ever shows up as a diff for you to review.
          </p>
        </div>

        <ol className="max-w-3xl">
          {HOOKS.map((hook, index) => (
            <HookRow key={hook.name} index={index} {...hook} />
          ))}
        </ol>

        <div className="flex flex-wrap items-center gap-3">
          <p className="font-medium text-sm">One hook runner. Four coding agents.</p>
          {AGENTS.map((agent) => (
            <Badge key={agent} variant="secondary">
              {agent}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

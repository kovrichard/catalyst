import { Badge } from "@/components/ui/badge";
import { mono } from "./fonts";

const HOOKS = [
  {
    cmd: "check",
    tool: "biome",
    desc: "Lint and format, so style nits never land in your diff.",
  },
  {
    cmd: "type-check",
    tool: "tsc",
    desc: "A full tsc --noEmit pass. A red squiggle never ships.",
  },
  {
    cmd: "knip",
    tool: "knip",
    desc: "Flags unused exports, files, and dependencies the agent left behind.",
  },
  {
    cmd: "jscpd",
    tool: "jscpd",
    desc: "Catches copy-paste. Fail it, and the agent must refactor, not raise the threshold.",
  },
  {
    cmd: "klint",
    tool: "klint",
    desc: "Enforces this repo's own layer rules, not just generic lint.",
  },
  {
    cmd: "madge",
    tool: "madge",
    desc: "Blocks circular imports before they turn into build-time mysteries.",
  },
  {
    cmd: "lf",
    tool: "git",
    desc: "Normalizes line endings, so diffs stay clean across machines.",
  },
];

const AGENTS = ["Claude Code", "Cursor", "Codex", "OpenCode"];

const CONFIG = `// .claude/settings.json
{
  "hooks": {
    "Stop": [
      { "hooks": [
        { "command": "bun .agents/hooks/check.ts" },
        { "command": "bun .agents/hooks/type-check.ts" },
        { "command": "bun .agents/hooks/knip.ts" },
        { "command": "bun .agents/hooks/jscpd.ts" },
        { "command": "bun .agents/hooks/klint.ts" },
        { "command": "bun .agents/hooks/madge.ts" },
        { "command": "bun .agents/hooks/lf.ts" }
      ] }
    ]
  }
}`;

function HookCard({ cmd, tool, desc }: { cmd: string; tool: string; desc: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card/40 p-5">
      <div className="flex items-center justify-between gap-2">
        <span className={`${mono.className} text-sm`}>
          <span className="text-emerald-500">✓ </span>
          {cmd}
        </span>
        <Badge variant="secondary" className={`${mono.className} text-xs`}>
          {tool}
        </Badge>
      </div>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  );
}

export function HookChecklist() {
  return (
    <section id="hooks" className="w-full border-b bg-muted/20">
      <div className="container flex flex-col gap-10 py-24">
        <div className="flex max-w-2xl flex-col gap-3">
          <p
            className={`${mono.className} flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            the stop hook
          </p>
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
            Seven checks between your agent and your review queue.
          </h2>
          <p className="text-lg text-muted-foreground">
            Every one runs on every turn. Miss none, skip none, and the agent can't raise
            a threshold to make a failure disappear.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOOKS.map((hook) => (
            <HookCard key={hook.cmd} {...hook} />
          ))}
          <div className="flex flex-col justify-center gap-2 rounded-xl border border-dashed bg-transparent p-5">
            <span className={`${mono.className} text-muted-foreground text-sm`}>
              + your own
            </span>
            <p className="text-muted-foreground text-sm">
              Drop a script in .agents/hooks and add one line to the Stop array.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t pt-8">
          <span className="font-medium text-sm">One runner. Four coding agents.</span>
          {AGENTS.map((agent) => (
            <Badge key={agent} variant="outline" className={`${mono.className} text-xs`}>
              {agent}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 items-center gap-8 rounded-xl border bg-card/40 p-6 lg:grid-cols-2 lg:p-8">
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-xl">No magic. It's in the repo.</h3>
            <p className="text-muted-foreground">
              The whole pipeline is a handful of lines in a config file you own, mirrored
              for Cursor, Codex, and OpenCode. Read it, edit it, delete a check you don't
              want.
            </p>
          </div>
          <pre
            className={`${mono.className} overflow-x-auto rounded-lg border bg-background/60 p-4 text-muted-foreground text-xs leading-relaxed`}
          >
            <code>{CONFIG}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

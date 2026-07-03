import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mono } from "./fonts";

const SKILLS = [
  {
    name: "frontend-design",
    trigger: "auto",
    description:
      "Pulls in a high-quality UI design skill so generated interfaces don't default to purple-gradient AI slop.",
  },
  {
    name: "lint",
    trigger: "manual",
    description:
      "Runs check-write, type-check, test, and build in order, auto-fixing what it safely can.",
  },
  {
    name: "optimize",
    trigger: "manual",
    description:
      "Scans for complexity, dead code, and performance issues, and proposes fixes one at a time, never a silent mass rewrite.",
  },
  {
    name: "remember",
    trigger: "manual",
    description:
      "Reflects on what just went wrong and proposes a new rule for AGENTS.md, so the same mistake doesn't happen twice.",
  },
  {
    name: "klint-rules",
    trigger: "manual",
    description:
      "Teaches the agent to add or edit klint's own architecture rules, so the linter grows with your codebase.",
  },
  {
    name: "your own",
    trigger: "byo",
    description:
      "Skills are plain markdown in .agents/skills, shared across Claude Code, Cursor, and the rest. Write your own playbook.",
  },
];

export function AgentSkills() {
  return (
    <section className="w-full border-b">
      <div className="container flex flex-col gap-10 py-24">
        <div className="flex max-w-2xl flex-col gap-3">
          <p
            className={`${mono.className} flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            .agents/skills
          </p>
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
            Playbooks your agent already knows.
          </h2>
          <p className="text-lg text-muted-foreground">
            The safety net stops bad edits. Skills push good ones, encoding the moves you
            reach for on every project.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((skill) => (
            <Card key={skill.name} className="bg-card/40">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className={`${mono.className} text-base`}>
                    {skill.name}
                  </CardTitle>
                  <span
                    className={`${mono.className} text-muted-foreground text-xs uppercase tracking-wide`}
                  >
                    {skill.trigger}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{skill.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

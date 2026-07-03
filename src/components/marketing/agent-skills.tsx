import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SKILLS = [
  {
    name: "frontend-design",
    trigger: "auto-invoked",
    description:
      "Pulls in a high-quality UI design skill so generated interfaces don't default to purple-gradient AI slop.",
  },
  {
    name: "lint",
    trigger: "manual",
    description:
      "Runs check-write → type-check → test → build in order, auto-fixing what it safely can.",
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
      "Reflects on what just went wrong in the conversation and proposes a new rule for AGENTS.md, so the same mistake doesn't happen twice.",
  },
  {
    name: "klint-rules",
    trigger: "manual",
    description:
      "Teaches the agent to add or edit klint's own architecture rules, so the linter evolves with your codebase.",
  },
];

export function AgentSkills() {
  return (
    <section className="w-full">
      <div className="container flex flex-col gap-8 py-24">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="flex items-center gap-2 font-mono text-muted-foreground text-xs uppercase tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            .agents/skills: reusable playbooks the agent can invoke
          </p>
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
            Skills your agent already knows.
          </h2>
          <p className="text-lg text-muted-foreground">
            Beyond the safety net, Catalyst ships opinionated playbooks for the situations
            every project runs into.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((skill) => (
            <Card key={skill.name}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="font-mono text-base">{skill.name}</CardTitle>
                  <span className="text-muted-foreground text-xs uppercase tracking-wide">
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

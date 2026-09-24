import { StoryBeat, Transcript, type TranscriptLine } from "./story-beat";

const TRANSCRIPT: TranscriptLine[] = [
  { kind: "you", text: 'Add a "last shipped" column to the projects table.' },
  { kind: "agent", text: "Done. Added the column, the query, and the UI." },
  { kind: "note", text: "stop hook: 8 checks" },
  {
    kind: "miss",
    tool: "klint",
    text: "projects-table.tsx: Prisma belongs in the DAO. Add a function under src/lib/dao/ and call that instead.",
  },
  {
    kind: "miss",
    tool: "tsc",
    text: "Property 'shippedAt' does not exist on type 'Project'",
  },
  { kind: "miss", tool: "jscpd", text: "getLastShipped() duplicated across 2 files" },
  { kind: "note", text: "sent back to the agent, not to you" },
  {
    kind: "agent",
    text: "Moving the query to src/lib/dao/projects.ts, adding shippedAt to the Project model, removing the copy.",
  },
  { kind: "note", text: "stop hook: 8 checks" },
  {
    kind: "pass",
    checks: [
      "check",
      "type-check",
      "knip",
      "jscpd",
      "klint",
      "madge",
      "lf",
      "secretlint",
    ],
  },
  { kind: "note", text: "you open the diff. nothing to fix." },
];

export function ClosedLoop() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: deep-linkable page anchor
    <StoryBeat
      id="closed-loop"
      headline="Your agent reviews itself now."
      lead="Eight checks run the moment your agent stops. Any failure goes back to the agent with the reason attached. It fixes the code and runs again. You see the diff once everything is green."
      artifact={<Transcript label="The same session with Catalyst" lines={TRANSCRIPT} />}
      closing="Your review starts at working code."
    />
  );
}

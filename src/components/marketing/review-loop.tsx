import { StoryBeat, Transcript, type TranscriptLine } from "./story-beat";

const TRANSCRIPT: TranscriptLine[] = [
  { kind: "you", text: 'Add a "last shipped" column to the projects table.' },
  { kind: "agent", text: "Done. Added the column, the query, and the UI. ✓" },
  { kind: "note", text: "you open the diff" },
  { kind: "miss", text: "projects-table.tsx imports prisma straight into a component" },
  { kind: "miss", text: "tsc: Property 'shippedAt' does not exist on type 'Project'" },
  { kind: "miss", text: "getLastShipped() now exists twice, one copy unused" },
  { kind: "you", text: "Components can't touch Prisma. And tsc is failing." },
  { kind: "agent", text: "You're right! Fixed. ✓" },
  { kind: "note", text: "it isn't. the query moved, and a copy stayed behind." },
];

export function ReviewLoop() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: deep-linkable page anchor targeted by the hero caret
    <StoryBeat
      id="review-loop"
      headline={
        <>
          You aren't shipping faster.
          <br />
          <span className="text-muted-foreground">
            You're reviewing more code than you write.
          </span>
        </>
      }
      lead="Every turn ends with you reading a diff for mistakes a linter should have caught. By the next prompt, the agent has forgotten them."
      artifact={<Transcript label="A typical agent session" lines={TRANSCRIPT} />}
      closing={
        <>
          <span className="text-muted-foreground">
            Same mistakes, every turn, and you catch them by hand.
          </span>{" "}
          Catalyst gives that job back to the agent.
        </>
      }
    />
  );
}

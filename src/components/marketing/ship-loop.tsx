import { StoryBeat, type TranscriptLine } from "./story-beat";

const TRANSCRIPT: TranscriptLine[] = [
  { kind: "you", text: "Ship it to stage." },
  { kind: "agent", text: "Pushed 4e1c9a2 to stage." },
  { kind: "note", text: "following the commit" },
  { kind: "pass", tool: "ci", checks: ["build", "test", "type-check"] },
  { kind: "pass", tool: "deploy", checks: ["stage finished, 4e1c9a2 is live"] },
  {
    kind: "pass",
    tool: "visual",
    checks: ['/projects renders the "last shipped" column'],
  },
  {
    kind: "agent",
    text: "Live on stage and checked. The PR into main is yours to open.",
  },
];

export function ShipLoop() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: deep-linkable page anchor
    <StoryBeat
      id="ship-loop"
      headline="Finished code isn't finished until it runs."
      lead="Push to stage and the agent follows the commit through CI and the deploy to the live URL. Then it opens the page and takes a screenshot. It never opens the PR into main. What reaches production is up to you."
      transcriptLabel="The agent following a deploy to stage"
      transcript={TRANSCRIPT}
      closing={
        <>
          <span className="text-muted-foreground">The agent proves it works.</span> You
          decide where it goes.
        </>
      }
    />
  );
}

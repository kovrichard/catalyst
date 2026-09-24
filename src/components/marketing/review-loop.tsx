import { display } from "@/lib/fonts";
import { mono } from "./fonts";

type Line =
  | { kind: "you" | "agent"; text: string }
  | { kind: "note"; text: string }
  | { kind: "miss"; text: string };

const TRANSCRIPT: Line[] = [
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

function TranscriptLine({ line }: { line: Line }) {
  if (line.kind === "note") {
    return (
      <li className="col-start-2 py-2 text-muted-foreground/60 italic">
        {`# ${line.text}`}
      </li>
    );
  }

  if (line.kind === "miss") {
    return (
      <li className="col-start-2 flex gap-3 border-red-400/40 border-l py-1 pl-4 text-red-300/90">
        <span aria-hidden="true">✗</span>
        <span>{line.text}</span>
      </li>
    );
  }

  return (
    <li className="col-span-2 grid grid-cols-subgrid py-2">
      <span className="text-[10px] text-muted-foreground/60 uppercase leading-6 tracking-widest sm:text-xs">
        {line.kind}
      </span>
      <span className={line.kind === "you" ? "text-foreground" : "text-foreground/70"}>
        {line.text}
      </span>
    </li>
  );
}

export function ReviewLoop() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: deep-linkable page anchor targeted by the hero caret
    <section id="review-loop" className="w-full border-b bg-muted/20">
      <div className="container flex flex-col gap-16 py-28 lg:gap-20 lg:py-36">
        <h2
          className={`${display.className} max-w-4xl text-balance font-bold text-[clamp(2rem,5.5vw,4rem)] leading-[1.05] tracking-tight`}
        >
          You aren't shipping faster.
          <br />
          <span className="text-muted-foreground">
            You're reviewing more code than you write.
          </span>
        </h2>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <p className="max-w-md text-balance text-lg text-muted-foreground leading-relaxed lg:col-span-4 lg:pt-8">
            Every turn ends with you reading a diff for mistakes a linter should have
            caught. By the next prompt, the agent has forgotten them.
          </p>

          <figure className="lg:col-span-8">
            <ol
              aria-label="A typical agent session"
              className={`${mono.className} grid grid-cols-[3rem_1fr] gap-x-3 overflow-x-auto rounded-lg border bg-background/70 p-4 text-[13px] leading-6 sm:grid-cols-[4.5rem_1fr] sm:gap-x-4 sm:p-8 sm:text-sm`}
            >
              {TRANSCRIPT.map((line) => (
                <TranscriptLine key={line.text} line={line} />
              ))}
            </ol>
          </figure>
        </div>

        <p
          className={`${display.className} max-w-3xl text-balance border-t pt-10 font-medium text-2xl leading-snug tracking-tight md:text-3xl`}
        >
          <span className="text-muted-foreground">
            Same mistakes, every turn, and you catch them by hand.
          </span>{" "}
          Catalyst gives that job back to the agent.
        </p>
      </div>
    </section>
  );
}

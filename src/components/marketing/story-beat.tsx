import type { ReactNode } from "react";
import { display } from "@/lib/fonts";
import { mono } from "./fonts";

export type TranscriptLine =
  | { kind: "you" | "agent"; text: string }
  | { kind: "note"; text: string }
  | { kind: "miss"; text: string; tool?: string }
  | { kind: "pass"; checks: string[]; tool?: string };

const VERDICT_STYLE = {
  miss: { mark: "✗", line: "border-red-400/40 text-red-300/90", tool: "text-red-300/50" },
  pass: {
    mark: "✓",
    line: "border-emerald-400/50 text-emerald-300",
    tool: "text-emerald-300/50",
  },
};

function Verdict({
  kind,
  tool,
  children,
}: {
  kind: keyof typeof VERDICT_STYLE;
  tool?: string;
  children: ReactNode;
}) {
  const style = VERDICT_STYLE[kind];

  return (
    <li className={`col-start-2 flex gap-3 border-l py-1 pl-4 ${style.line}`}>
      <span aria-hidden="true">{style.mark}</span>
      <span className="flex flex-col sm:flex-row sm:gap-3">
        {tool ? <span className={`min-w-[6ch] ${style.tool}`}>{tool}</span> : null}
        <span>{children}</span>
      </span>
    </li>
  );
}

function Line({ line }: { line: TranscriptLine }) {
  if (line.kind === "note") {
    return (
      <li className="col-start-2 py-2 text-muted-foreground/60 italic">
        {`# ${line.text}`}
      </li>
    );
  }

  if (line.kind === "miss") {
    return (
      <Verdict kind="miss" tool={line.tool}>
        {line.text}
      </Verdict>
    );
  }

  if (line.kind === "pass") {
    return (
      <Verdict kind="pass" tool={line.tool}>
        <span className="flex flex-wrap gap-x-2">
          {line.checks.map((check, i) => (
            <span key={check}>
              {check}
              {i < line.checks.length - 1 && (
                <span className="pl-2 text-emerald-300/40">·</span>
              )}
            </span>
          ))}
        </span>
      </Verdict>
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

function Transcript({ label, lines }: { label: string; lines: TranscriptLine[] }) {
  return (
    <ol
      aria-label={label}
      className={`${mono.className} grid grid-cols-[3rem_1fr] gap-x-3 overflow-x-auto rounded-lg border bg-background/70 p-4 text-[13px] leading-6 sm:grid-cols-[4.5rem_1fr] sm:gap-x-4 sm:p-8 sm:text-sm`}
    >
      {lines.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static script that never reorders, and repeated notes share text
        <Line key={i} line={line} />
      ))}
    </ol>
  );
}

export function StoryBeat({
  id,
  headline,
  lead,
  transcriptLabel,
  transcript,
  closing,
}: {
  id: string;
  headline: ReactNode;
  lead: string;
  transcriptLabel: string;
  transcript: TranscriptLine[];
  closing: ReactNode;
}) {
  return (
    <section id={id} className="w-full border-b bg-muted/20">
      <div className="container flex flex-col gap-16 py-28 lg:gap-20 lg:py-36">
        <h2
          className={`${display.className} max-w-4xl text-balance font-bold text-[clamp(2rem,5.5vw,4rem)] leading-[1.05] tracking-tight`}
        >
          {headline}
        </h2>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <p className="max-w-md text-balance text-lg text-muted-foreground leading-relaxed lg:col-span-4 lg:pt-8">
            {lead}
          </p>

          <figure className="lg:col-span-8">
            <Transcript label={transcriptLabel} lines={transcript} />
          </figure>
        </div>

        <p
          className={`${display.className} max-w-3xl text-balance border-t pt-10 font-medium text-2xl leading-snug tracking-tight md:text-3xl`}
        >
          {closing}
        </p>
      </div>
    </section>
  );
}

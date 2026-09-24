import { display } from "@/lib/fonts";
import { mono } from "./fonts";
import { StoryBeat } from "./story-beat";

const CLIENTS = ["Claude Code", "Cursor", "OpenCode"];

const GATES = [
  { title: "API key", detail: "minted in your app's settings" },
  { title: "Rate limit", detail: "120 a minute per key, then 429" },
  { title: "User scope", detail: "rows filtered to the key's owner" },
  { title: "Allowlist", detail: "columns hidden unless listed" },
];

const WIDE_CLIENT_CENTERS = [18.5, 54.5, 90.5];
const WIDE_MERGE_Y = 54.5;
const NARROW_CLIENT_CENTERS = [48.5, 144.5, 240.5];
const NARROW_MERGE_X = 144.5;

function WideMerge() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 108"
      preserveAspectRatio="none"
      className="ml-4 hidden h-[108px] w-12 text-foreground/25 lg:block"
    >
      {WIDE_CLIENT_CENTERS.map((y) => (
        <path
          key={y}
          d={`M0 ${y} C 28 ${y}, 20 ${WIDE_MERGE_Y}, 48 ${WIDE_MERGE_Y}`}
          fill="none"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

function NarrowMerge() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 288 40"
      preserveAspectRatio="none"
      className="mt-2 h-10 w-72 text-foreground/25 lg:hidden"
    >
      {NARROW_CLIENT_CENTERS.map((x) => (
        <path
          key={x}
          d={`M${x} 0 C ${x} 22, ${NARROW_MERGE_X} 18, ${NARROW_MERGE_X} 40`}
          fill="none"
          stroke="currentColor"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

function Clients() {
  return (
    <div className="flex shrink-0 flex-col items-center lg:flex-row">
      <ul className="grid grid-cols-[repeat(3,6rem)] text-center text-muted-foreground text-sm lg:flex lg:flex-col lg:items-end lg:text-right lg:leading-9">
        {CLIENTS.map((client) => (
          <li key={client}>{client}</li>
        ))}
      </ul>
      <NarrowMerge />
      <WideMerge />
    </div>
  );
}

function Gate({
  title,
  detail,
  side,
}: {
  title: string;
  detail: string;
  side: "left" | "right";
}) {
  const narrowSide =
    side === "right" ? "col-start-2 pl-8 text-left" : "col-start-1 pr-8 text-right";

  return (
    <li className="relative grid w-full grid-cols-2 items-center py-4 lg:flex lg:h-36 lg:w-auto lg:flex-1 lg:flex-col lg:justify-center lg:p-0">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-px bg-foreground/25 lg:inset-x-0 lg:top-1/2 lg:bottom-auto lg:h-px lg:w-auto"
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-px w-10 -translate-x-1/2 bg-foreground/60 lg:static lg:h-10 lg:w-px lg:translate-x-0"
      />
      <span
        className={`row-start-1 flex flex-col lg:absolute lg:inset-x-2 lg:top-[calc(50%+1.75rem)] lg:p-0 lg:text-center ${narrowSide}`}
      >
        <span className="font-medium text-foreground/90 text-sm">{title}</span>
        <span className="text-muted-foreground text-xs">{detail}</span>
      </span>
    </li>
  );
}

function YourModels() {
  return (
    <div className="relative w-52 shrink-0 rounded-lg bg-foreground px-8 py-4 text-center text-background lg:text-left">
      <span
        aria-hidden="true"
        className="absolute -top-2 left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-t-[8px] border-t-foreground/60 lg:hidden"
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 -left-2 hidden -translate-y-1/2 border-y-[5px] border-y-transparent border-l-[8px] border-l-foreground/60 lg:block"
      />
      <p className={`${display.className} font-semibold text-lg`}>Your models</p>
      <p className={`${mono.className} text-background/60 text-xs`}>
        src/lib/mcp/registry.ts
      </p>
    </div>
  );
}

function RequestPath() {
  return (
    <div className="flex flex-col items-center lg:flex-row">
      <Clients />
      <ol
        aria-label="What an agent's request passes through"
        className="flex w-full flex-col lg:w-auto lg:flex-1 lg:flex-row"
      >
        {GATES.map((gate, i) => (
          <Gate key={gate.title} {...gate} side={i % 2 === 0 ? "right" : "left"} />
        ))}
      </ol>
      <YourModels />
    </div>
  );
}

export function McpServer() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: deep-linkable page anchor
    <StoryBeat
      id="mcp"
      wide
      headline="Your next users won't open a browser."
      lead={
        <>
          Every app will need an MCP server. Catalyst ships one at <code>/api/mcp</code>,
          with the hard parts built in: API keys your users mint in settings, rate limits
          per key, every query scoped to the key's owner, and nothing exposed unless you
          list it. It starts read-only. Adding write access is your call.
        </>
      }
      artifact={<RequestPath />}
      closing={
        <>
          <span className="text-muted-foreground">
            Read-only today, read-write when you're ready.
          </span>{" "}
          The plumbing is already there.
        </>
      }
    />
  );
}

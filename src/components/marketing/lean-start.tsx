import { display } from "@/lib/fonts";
import { mono } from "./fonts";
import { StoryBeat } from "./story-beat";

const REMOVABLE = [
  { name: "Auth", removed: false },
  { name: "Database", removed: false },
  { name: "Stripe", removed: true },
  { name: "Email", removed: false },
  { name: "Storage", removed: true },
  { name: "Redis", removed: true },
  { name: "tRPC", removed: false },
  { name: "MCP", removed: false },
];

const CORE = ["Next.js", "Tailwind", "shadcn/ui", "Biome", "Bun"];

function FeatureList() {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <p className={`${mono.className} text-muted-foreground/60 text-xs`}>
        after bun run configure
      </p>
      <ul
        className={`${display.className} flex flex-wrap justify-center gap-x-6 gap-y-1 font-bold text-[clamp(2rem,6vw,4.5rem)] leading-[1.1] tracking-tight sm:gap-x-10`}
      >
        {REMOVABLE.map((feature) => (
          <li key={feature.name}>
            {feature.removed ? (
              <del className="text-muted-foreground/30 decoration-2">{feature.name}</del>
            ) : (
              feature.name
            )}
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground text-sm">
        Always there:{" "}
        {CORE.map((item, i) => (
          <span key={item}>
            {item}
            {i < CORE.length - 1 && (
              <span className="px-2 text-muted-foreground/40">·</span>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}

function ConfigureCommand() {
  return (
    <p
      className={`${mono.className} w-fit shrink-0 rounded-lg border bg-background/70 px-5 py-3 text-foreground text-sm`}
    >
      <span className="pr-3 text-muted-foreground/60">$</span>
      bun run configure
    </p>
  );
}

export function LeanStart() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: deep-linkable page anchor
    <StoryBeat
      id="lean-start"
      wide
      headline={
        <>
          A head start you have to dig out of
          <br />
          <span className="text-muted-foreground">is not a head start.</span>
        </>
      }
      lead={
        <>
          Every feature you don't need is code you read, maintain and work around, and
          your agent reads it too. So most teams tear the boilerplate apart or start over.
          Catalyst ships with everything wired up, and <code>bun run configure</code>{" "}
          removes what you don't need. A lint rule keeps features independent, so removing
          one never breaks another.
        </>
      }
      aside={<ConfigureCommand />}
      artifact={<FeatureList />}
      closing={
        <>
          <span className="text-muted-foreground">Start with everything.</span> Ship only
          what you use.
        </>
      }
    />
  );
}

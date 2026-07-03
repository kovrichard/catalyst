import { mono } from "./fonts";

const STEPS = [
  {
    n: "01",
    title: "Your agent finishes a turn",
    body: "Claude Code, Cursor, Codex, or OpenCode edits your files and hands control back.",
  },
  {
    n: "02",
    title: "The stop hook fires",
    body: "One runner kicks off all seven checks automatically. No prompt, no waiting on CI.",
  },
  {
    n: "03",
    title: "The diff gets gated",
    body: "Pass, and it reaches your review clean. Fail, and the agent reads the error and fixes it, then runs again.",
  },
];

export function Pipeline() {
  return (
    <section id="pipeline" className="w-full border-b">
      <div className="container flex flex-col gap-10 py-20">
        <div className="flex max-w-2xl flex-col gap-3">
          <p
            className={`${mono.className} flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            how it works
          </p>
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
            A review loop that runs itself.
          </h2>
        </div>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="relative flex flex-col gap-3 rounded-xl border bg-card/40 p-6"
            >
              <span className={`${mono.className} text-emerald-500 text-sm`}>
                {step.n}
              </span>
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className={`${mono.className} text-muted-foreground text-sm`}>
          {
            "// the loop repeats until every check is green. you review working code, not typos."
          }
        </p>
      </div>
    </section>
  );
}

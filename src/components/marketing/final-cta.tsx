import { display } from "@/lib/fonts";
import { REPO_URL } from "@/lib/repo";
import { CommandLine } from "./command-line";
import { StarfieldBackground } from "./starfield-background";
import { BEAT_HEADLINE } from "./story-beat";

export function FinalCta() {
  return (
    <section className="relative z-10 w-full bg-space [clip-path:inset(0)] after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-border">
      <StarfieldBackground variant="reveal" />
      <div className="container flex flex-col items-center gap-8 py-32 text-center">
        <h2 className={`${display.className} ${BEAT_HEADLINE}`}>
          Now you're shipping faster.
          <br />
          <span className="text-muted-foreground">For real this time.</span>
        </h2>
        <p className="max-w-xl text-balance text-lg text-muted-foreground leading-relaxed">
          Clone it, run <code>bun run configure</code>, and your agent checks its own work
          from the first prompt.
        </p>
        <CommandLine command={`git clone ${REPO_URL}.git`} copyable />
      </div>
    </section>
  );
}

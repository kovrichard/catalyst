import { AgentSkills } from "@/components/marketing/agent-skills";
import { AlsoIncluded, FinalCta } from "@/components/marketing/also-included";
import { Hero } from "@/components/marketing/hero";
import { HookChecklist } from "@/components/marketing/hook-checklist";
import { Pipeline } from "@/components/marketing/pipeline";
import { logger } from "@/lib/logger";

export default function Home() {
  logger.info("Hello, Catalyst!");

  return (
    <main className="flex flex-1 flex-col items-center overflow-x-hidden">
      <Hero />
      <Pipeline />
      <HookChecklist />
      <AgentSkills />
      <AlsoIncluded />
      <FinalCta />
    </main>
  );
}

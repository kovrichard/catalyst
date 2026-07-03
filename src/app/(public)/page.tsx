import { AgentSkills } from "@/components/marketing/agent-skills";
import { AlsoIncluded } from "@/components/marketing/also-included";
import { Hero } from "@/components/marketing/hero";
import { HookChecklist } from "@/components/marketing/hook-checklist";
import { logger } from "@/lib/logger";

export default function Home() {
  logger.info("Hello, Catalyst!");

  return (
    <main className="flex flex-1 flex-col items-center overflow-x-hidden">
      <Hero />
      <HookChecklist />
      <AgentSkills />
      <AlsoIncluded />
    </main>
  );
}

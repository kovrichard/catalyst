import type { Metadata } from "next";
import { AgentSkills } from "@/components/marketing/agent-skills";
import { AlsoIncluded, FinalCta } from "@/components/marketing/also-included";
import { Hero } from "@/components/marketing/hero";
import { HookChecklist } from "@/components/marketing/hook-checklist";
import { McpServer } from "@/components/marketing/mcp-server";
import { Pipeline } from "@/components/marketing/pipeline";
import {
  ScrollStage,
  StageAnchor,
  StageSlide,
} from "@/components/marketing/scroll-stage";
import { StarfieldBackground } from "@/components/marketing/starfield-background";
import { logger } from "@/lib/logger";
import { metaDescription, metaTitle, openGraph } from "@/lib/metadata";

const path = "/";

export const metadata: Metadata = {
  title: metaTitle,
  description: metaDescription,
  alternates: {
    canonical: path,
  },
  openGraph: {
    ...openGraph,
    url: path,
  },
};

export default function Home() {
  logger.info("Hello, Catalyst!");

  return (
    <>
      <StarfieldBackground />
      <main className="flex flex-1 flex-col items-center overflow-x-clip">
        <ScrollStage runway="240svh">
          {/* biome-ignore lint/correctness/useUniqueElementIds: deep-linkable page anchor targeted by href="#pipeline" */}
          <StageAnchor id="pipeline" at="60svh" />
          <StageSlide>
            <Hero />
          </StageSlide>
          <StageSlide from="25svh" to="145svh">
            <Pipeline />
          </StageSlide>
        </ScrollStage>
        <HookChecklist />
        <AgentSkills />
        <McpServer />
        <AlsoIncluded />
        <FinalCta />
      </main>
    </>
  );
}

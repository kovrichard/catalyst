import type { Metadata } from "next";
import { AgentSkills } from "@/components/marketing/agent-skills";
import { FinalCta } from "@/components/marketing/also-included";
import { ClosedLoop } from "@/components/marketing/closed-loop";
import { Hero } from "@/components/marketing/hero";
import { HookChecklist } from "@/components/marketing/hook-checklist";
import { LeanStart } from "@/components/marketing/lean-start";
import { McpServer } from "@/components/marketing/mcp-server";
import { ReviewLoop } from "@/components/marketing/review-loop";
import { ShipLoop } from "@/components/marketing/ship-loop";
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
        <section className="h-[200svh] w-full">
          <div className="sticky top-header h-[calc(100svh-var(--spacing-header))]">
            <Hero />
          </div>
        </section>
        <ReviewLoop />
        <ClosedLoop />
        <ShipLoop />
        <McpServer />
        <LeanStart />
        <HookChecklist />
        <AgentSkills />
        <FinalCta />
      </main>
    </>
  );
}

import { FlipWords } from "@/components/ui/flip-words";
import { logger } from "@/lib/logger";
import Image from "next/image";

export default function Home() {
  logger.info("Hello, Catalyst!");
  const words = [
    "Next.js",
    "Tailwind",
    "shadcn/ui",
    "Auth.js",
    "Stripe",
    "Prisma",
    "Husky",
    "Biome",
    "Bun.js",
    "Joi",
    "Winston",
  ];

  return (
    <main className="flex flex-1">
      <section className="flex flex-col items-center justify-center gap-8 max-w-7xl h-[80vh] mx-auto p-4">
        <div className="text-6xl font-bold text-center text-neutral-600 space-y-2 text-[clamp(1.6rem,8vw,4rem)]">
          <p>A Starter Kit with</p>
          <FlipWords words={words} duration={2500} />
          <p>Integration</p>
        </div>
        <div className="space-y-2 text-center text-xl text-balance max-w-2xl">
          <p>Spend less time on configuring, and more on shipping.</p>
        </div>
      </section>
    </main>
  );
}

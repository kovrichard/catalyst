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
    "Zod",
    "Winston",
    "Amazon SES",
    "React Email",
  ];

  return (
    <main className="flex flex-col items-center flex-1 overflow-x-hidden">
      <section className="flex flex-col items-center justify-center gap-8 max-w-7xl h-[80vh] mx-auto p-4">
        <div className="relative leading-none font-bold text-center text-neutral-600 space-y-2 text-[clamp(1.6rem,7vw,4.5rem)]">
          <p>A Starter Kit with</p>
          <FlipWords
            words={words}
            duration={2500}
            className="text-center w-[70vw] max-w-6xl text-neutral-900"
          />
          <p>Integration</p>
        </div>
        <div className="space-y-2 text-center text-xl text-balance max-w-2xl">
          <p>Spend less time on configuring, and more on shipping.</p>
        </div>
      </section>
    </main>
  );
}

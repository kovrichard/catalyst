import {
  Code2,
  Database,
  FileCode,
  GitBranch,
  Lock,
  Mail,
  Palette,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { CursorFloat } from "@/components/animations/cursor-float";
import { ScrollFloat } from "@/components/animations/scroll-float";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { ScrollRotate } from "@/components/animations/scroll-rotate";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiagonalEdge } from "@/components/ui/diagonal-edge";
import { ShinyBorder } from "@/components/ui/shiny-border";
import { logger } from "@/lib/logger";

/**
 * Render the Catalyst landing page that showcases included integrations, features, and animated UI elements.
 *
 * The component logs "Hello, Catalyst!" when rendered and returns the page's JSX structure including hero,
 * integrations grid, and feature sections with decorative diagonal edges and animations.
 *
 * @returns The React element for the landing page.
 */
export default function Home() {
  logger.info("Hello, Catalyst!");

  const integrations = [
    {
      category: "Framework & Runtime",
      icon: Zap,
      tools: [
        { name: "Next.js", color: "bg-black text-white" },
        { name: "Bun.js", color: "bg-[#FBF1DF] text-black" },
        { name: "React", color: "bg-[#58C4DC] text-black" },
      ],
    },
    {
      category: "Styling",
      icon: Palette,
      tools: [
        { name: "Tailwind CSS", color: "bg-[#00BCFF] text-white" },
        { name: "shadcn/ui", color: "bg-black text-white" },
      ],
    },
    {
      category: "Authentication & Security",
      icon: Lock,
      tools: [
        { name: "Auth.js", color: "bg-black text-white" },
        { name: "Zod", color: "bg-[#428EFF] text-white" },
      ],
    },
    {
      category: "Database & ORM",
      icon: Database,
      tools: [
        { name: "Prisma", color: "bg-[#090A15] text-white" },
        { name: "PostgreSQL", color: "bg-[#336792] text-white" },
      ],
    },
    {
      category: "Payments",
      icon: ShieldCheck,
      tools: [{ name: "Stripe", color: "bg-[#635CFF] text-white" }],
    },
    {
      category: "Email & Logging",
      icon: Mail,
      tools: [
        { name: "Amazon SES", color: "bg-[#FF6301] text-white" },
        { name: "React Email", color: "bg-[#010103] text-white" },
        { name: "Winston", color: "bg-blue-500 text-white" },
      ],
    },
    {
      category: "Code Quality",
      icon: GitBranch,
      tools: [
        { name: "Biome", color: "bg-[#61A6FB] text-white" },
        { name: "Husky", color: "bg-[#161618] text-white" },
        { name: "TypeScript", color: "bg-[#3279C6] text-white" },
        { name: "tRPC", color: "bg-[#398CCB] text-white" },
      ],
    },
  ];

  return (
    <main className="flex flex-1 flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full">
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-20 text-center lg:min-h-[40rem]">
          <Badge variant="outline" className="mb-2">
            <Sparkles className="mr-1 h-3 w-3" />
            Production Ready
          </Badge>
          <h1 className="font-bold text-5xl tracking-tight md:text-6xl lg:text-7xl">
            Ship{" "}
            <span className="inline-block animate-shine bg-[length:200%_auto] bg-gradient-to-r from-slate-500 via-white to-slate-500 [text-shadow:0_0.5px_1px_rgba(0,0,0,0.2)]">
              Faster
            </span>{" "}
            With
            <span className="mt-2 block text-primary">Catalyst</span>
          </h1>
          <p className="max-w-2xl text-muted-foreground text-xl">
            A modern, full-stack Next.js starter kit with authentication, payments,
            database, and everything you need to build your next project.
          </p>
          <div className="mt-4 flex gap-3">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              TypeScript
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              tRPC
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Server Components
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Server Actions
            </Badge>
          </div>
        </div>
      </section>

      {/* Top diagonal edge */}
      <div className="relative w-full">
        <DiagonalEdge corner="bl" size={64} color="muted" />
      </div>
      {/* Integrations section with diagonal borders */}
      <section className="w-full bg-muted">
        <div className="container relative z-10 py-6">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-bold text-3xl">Built with the best tools</h2>
            <p className="text-muted-foreground">
              Pre-configured and ready to use. Spend less time on setup, more on shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <ScrollRotate key={integration.category}>
                  <ShinyBorder>
                    <Card className="border-0">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-lg">
                            {integration.category}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {integration.tools.map((tool) => (
                            <Badge key={tool.name} className={tool.color}>
                              {tool.name}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </ShinyBorder>
                </ScrollRotate>
              );
            })}
          </div>
        </div>
      </section>
      {/* Bottom diagonal edge */}
      <div className="relative w-full">
        <DiagonalEdge corner="tl" size={64} color="muted" />
      </div>

      {/* Features Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <ScrollReveal delay={0}>
            <ScrollFloat direction="y" distance={-30} stopPercentage={50} lag={3}>
              <div className="flex flex-col items-center gap-3 text-center">
                <CursorFloat radius={30} lag={2} intensity={0.3}>
                  <div className="rounded-full bg-primary/10 p-3">
                    <Code2 className="h-6 w-6 text-primary" />
                  </div>
                </CursorFloat>
                <h3 className="font-semibold text-xl">Type-Safe</h3>
                <p className="text-muted-foreground text-sm">
                  End-to-end type safety with TypeScript, tRPC, Zod validation, and Prisma
                  ORM.
                </p>
              </div>
            </ScrollFloat>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ScrollFloat direction="y" distance={-30} stopPercentage={50} lag={3}>
              <div className="flex flex-col items-center gap-3 text-center">
                <CursorFloat radius={30} lag={2} intensity={0.3}>
                  <div className="rounded-full bg-primary/10 p-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                </CursorFloat>
                <h3 className="font-semibold text-xl">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm">
                  Built on Next.js 15 with React Server Components and powered by Bun.js.
                </p>
              </div>
            </ScrollFloat>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <ScrollFloat direction="y" distance={-30} stopPercentage={50} lag={3}>
              <div className="flex flex-col items-center gap-3 text-center">
                <CursorFloat radius={30} lag={2} intensity={0.3}>
                  <div className="rounded-full bg-primary/10 p-3">
                    <FileCode className="h-6 w-6 text-primary" />
                  </div>
                </CursorFloat>
                <h3 className="font-semibold text-xl">Developer Experience</h3>
                <p className="text-muted-foreground text-sm">
                  Pre-configured tooling with Biome, Husky, and best practices out of the
                  box.
                </p>
              </div>
            </ScrollFloat>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
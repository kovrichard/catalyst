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
    <main className="flex flex-col items-center flex-1 overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full">
        <div className="flex flex-col items-center justify-center gap-6 min-h-[60vh] lg:min-h-[40rem] mx-auto px-6 py-20 text-center container">
          <Badge variant="outline" className="mb-2">
            <Sparkles className="w-3 h-3 mr-1" />
            Production Ready
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Ship{" "}
            <span className="inline-block bg-gradient-to-r from-slate-500 via-white to-slate-500 bg-[length:200%_auto] animate-shine [text-shadow:0_0.5px_1px_rgba(0,0,0,0.2)]">
              Faster
            </span>{" "}
            With
            <span className="block text-primary mt-2">Catalyst</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A modern, full-stack Next.js starter kit with authentication, payments,
            database, and everything you need to build your next project.
          </p>
          <div className="flex gap-3 mt-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              TypeScript
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              tRPC
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Server Components
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Built with the best tools</h2>
            <p className="text-muted-foreground">
              Pre-configured and ready to use. Spend less time on setup, more on shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <ScrollRotate key={integration.category}>
                  <ShinyBorder>
                    <Card className="border-0">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="w-5 h-5 text-primary" />
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
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal delay={0}>
            <ScrollFloat direction="y" distance={-30} stopPercentage={50} lag={3}>
              <div className="flex flex-col items-center text-center gap-3">
                <CursorFloat radius={30} lag={2} intensity={0.3}>
                  <div className="p-3 rounded-full bg-primary/10">
                    <Code2 className="w-6 h-6 text-primary" />
                  </div>
                </CursorFloat>
                <h3 className="text-xl font-semibold">Type-Safe</h3>
                <p className="text-muted-foreground text-sm">
                  End-to-end type safety with TypeScript, tRPC, Zod validation, and Prisma
                  ORM.
                </p>
              </div>
            </ScrollFloat>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ScrollFloat direction="y" distance={-30} stopPercentage={50} lag={3}>
              <div className="flex flex-col items-center text-center gap-3">
                <CursorFloat radius={30} lag={2} intensity={0.3}>
                  <div className="p-3 rounded-full bg-primary/10">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                </CursorFloat>
                <h3 className="text-xl font-semibold">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm">
                  Built on Next.js 15 with React Server Components and powered by Bun.js.
                </p>
              </div>
            </ScrollFloat>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <ScrollFloat direction="y" distance={-30} stopPercentage={50} lag={3}>
              <div className="flex flex-col items-center text-center gap-3">
                <CursorFloat radius={30} lag={2} intensity={0.3}>
                  <div className="p-3 rounded-full bg-primary/10">
                    <FileCode className="w-6 h-6 text-primary" />
                  </div>
                </CursorFloat>
                <h3 className="text-xl font-semibold">Developer Experience</h3>
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

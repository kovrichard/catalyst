import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logger } from "@/lib/logger";
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

export default function Home() {
  logger.info("Hello, Catalyst!");

  const integrations = [
    {
      category: "Framework & Runtime",
      icon: Zap,
      tools: ["Next.js", "Bun.js", "React"],
    },
    {
      category: "Styling",
      icon: Palette,
      tools: ["Tailwind CSS", "shadcn/ui"],
    },
    {
      category: "Authentication & Security",
      icon: Lock,
      tools: ["Auth.js", "Zod"],
    },
    {
      category: "Database & ORM",
      icon: Database,
      tools: ["Prisma", "PostgreSQL"],
    },
    {
      category: "Payments",
      icon: ShieldCheck,
      tools: ["Stripe"],
    },
    {
      category: "Email & Logging",
      icon: Mail,
      tools: ["Amazon SES", "React Email", "Winston"],
    },
    {
      category: "Code Quality",
      icon: GitBranch,
      tools: ["Biome", "Husky", "TypeScript", "tRPC"],
    },
  ];

  return (
    <main className="flex flex-col items-center flex-1">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-6 max-w-5xl min-h-[60vh] mx-auto px-6 py-20 text-center">
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
      </section>

      {/* Integrations Grid */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16">
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
              <Card
                key={integration.category}
                className="border-2 hover:border-primary/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{integration.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {integration.tools.map((tool) => (
                      <Badge key={tool} variant="secondary">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Type-Safe</h3>
            <p className="text-muted-foreground text-sm">
              End-to-end type safety with TypeScript, tRPC, Zod validation, and Prisma
              ORM.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground text-sm">
              Built on Next.js 15 with React Server Components and powered by Bun.js.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <FileCode className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Developer Experience</h3>
            <p className="text-muted-foreground text-sm">
              Pre-configured tooling with Biome, Husky, and best practices out of the box.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

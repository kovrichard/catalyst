import { Eye, Filter, ListTree, ShieldCheck, Table2 } from "lucide-react";
import { mono } from "./fonts";

const TOOLS = [
  {
    icon: ListTree,
    name: "list_tables",
    desc: "Every table exposed to the caller, each with a note on how it's scoped.",
  },
  {
    icon: Table2,
    name: "describe_table",
    desc: "A table's columns, their types, and which are filterable or sortable.",
  },
  {
    icon: Filter,
    name: "query_table",
    desc: "Read rows with typed filters, sorting, and cursor paging. Never another user's.",
  },
  {
    icon: Eye,
    name: "get_record",
    desc: "Fetch a single row by id. Returns null the moment you don't own it.",
  },
];

const GUARANTEES = [
  "read-only",
  "user-scoped in the DAO",
  "registry allowlist",
  "API-key auth",
];

const CONFIG = `// connect any agent that speaks Streamable HTTP
$ export CATALYST_MCP_KEY="paste-key-from-settings"
$ bun run mcp:sync        // writes .mcp.json, cursor, opencode

$ claude "which of my projects shipped last week?"
● querying catalyst · list_tables → query_table
✓ 3 rows · scoped to you · read-only`;

export function McpServer() {
  return (
    <section className="w-full border-b">
      <div className="container flex flex-col gap-10 py-24">
        <div className="flex max-w-2xl flex-col gap-3">
          <p
            className={`${mono.className} flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            api/mcp
          </p>
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
            Your agent can query the running app.
          </h2>
          <p className="text-lg text-muted-foreground">
            Catalyst ships a read-only MCP server at <code>/api/mcp</code>. Hand an
            external agent an API key and it queries your live database directly, no stdio
            bridge, no glue code. Every read is clamped to the caller's own rows.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.name}
                  className="flex flex-col gap-2 rounded-xl border bg-card/40 p-5"
                >
                  <Icon className="h-5 w-5 text-emerald-500" />
                  <h3 className={`${mono.className} font-semibold text-sm`}>
                    {tool.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{tool.desc}</p>
                </div>
              );
            })}
          </div>

          <div
            className={`${mono.className} flex flex-col overflow-hidden rounded-xl border bg-card/70 shadow-2xl backdrop-blur`}
          >
            <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-2 text-muted-foreground text-xs">
                external agent · api key
              </span>
            </div>
            <pre className="overflow-x-auto p-4 text-foreground/80 text-sm leading-relaxed">
              {CONFIG}
            </pre>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-2 font-medium text-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Safe by construction
          </span>
          {GUARANTEES.map((item) => (
            <span
              key={item}
              className={`${mono.className} text-muted-foreground text-xs uppercase tracking-widest`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

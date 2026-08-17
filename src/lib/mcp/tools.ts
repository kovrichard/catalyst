import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import {
  getRecord,
  maxLimit,
  minLimit,
  type QueryFilter,
  queryModel,
} from "@/lib/dao/mcp";
import { userIdFromAuthInfo } from "@/lib/mcp/auth";
import {
  describeTable,
  type ExposedModel,
  exposedModels,
  exposedTables,
  listTables,
  modelForTable,
} from "@/lib/mcp/registry";

const schemaResourceUri = "catalyst://schema";

const filterSchema = z.object({
  field: z.string(),
  operator: z.enum(["equals", "not", "contains", "gt", "gte", "lt", "lte"]),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

const tableSchema = z.string().describe("Table name from list_tables");

type ToolContext = { http?: { authInfo?: { extra?: Record<string, unknown> } } };

function isStructured(payload: unknown): payload is Record<string, unknown> {
  return typeof payload === "object" && payload !== null && !Array.isArray(payload);
}

function jsonResult(payload: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
    ...(isStructured(payload) ? { structuredContent: payload } : {}),
  };
}

function errorResult(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}

function toExposedModel(table: string): ExposedModel {
  const model = modelForTable(table);
  if (!model) {
    throw new Error(
      `Unknown table "${table}". Available tables: ${exposedTables().join(", ")}.`
    );
  }
  return model;
}

function callerId(ctx: ToolContext): string {
  return userIdFromAuthInfo(
    ctx.http?.authInfo as Parameters<typeof userIdFromAuthInfo>[0]
  );
}

async function guarded(run: () => Promise<unknown>) {
  try {
    return jsonResult(await run());
  } catch (error) {
    return errorResult(error instanceof Error ? error.message : String(error));
  }
}

export function registerMcpTools(server: McpServer): void {
  server.registerTool(
    "list_tables",
    {
      title: "List tables",
      description:
        "List every database table exposed over MCP, with a note on how each is scoped to you.",
      inputSchema: z.object({}),
    },
    () => jsonResult(listTables())
  );

  server.registerTool(
    "describe_table",
    {
      title: "Describe table",
      description:
        "Show a table's columns, their types, and which are filterable or sortable.",
      inputSchema: z.object({ table: tableSchema }),
    },
    ({ table }) => guarded(async () => describeTable(toExposedModel(table)))
  );

  server.registerTool(
    "query_table",
    {
      title: "Query table",
      description:
        "Read rows from a table. Results are always limited to records you own. Use the cursor from a previous response to page.",
      inputSchema: z.object({
        table: tableSchema,
        filters: z.array(filterSchema).max(20).optional(),
        orderBy: z
          .object({ field: z.string(), direction: z.enum(["asc", "desc"]) })
          .optional(),
        limit: z.number().int().min(minLimit).max(maxLimit).optional(),
        cursor: z.string().optional(),
      }),
      outputSchema: z.object({
        rows: z.array(z.record(z.string(), z.unknown())),
        total: z.number(),
        limit: z.number(),
        nextCursor: z.string().nullable(),
      }),
    },
    ({ table, filters, orderBy, limit, cursor }, ctx) =>
      guarded(async () =>
        queryModel(toExposedModel(table), callerId(ctx as ToolContext), {
          filters: filters as QueryFilter[] | undefined,
          orderBy,
          limit,
          cursor,
        })
      )
  );

  server.registerTool(
    "get_record",
    {
      title: "Get record",
      description: "Fetch a single row by id. Returns null when you do not own it.",
      inputSchema: z.object({ table: tableSchema, id: z.string() }),
    },
    ({ table, id }, ctx) =>
      guarded(async () =>
        getRecord(toExposedModel(table), callerId(ctx as ToolContext), id)
      )
  );

  server.registerResource(
    "schema",
    schemaResourceUri,
    {
      title: "Database schema",
      description: "Every exposed table and column in one document.",
      mimeType: "application/json",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(exposedModels().map(describeTable), null, 2),
        },
      ],
    })
  );
}

#!/usr/bin/env bun

/**
 * Generates each agent's MCP config from the canonical `.agents/mcp.json`.
 *
 * The three agents expand environment variables with incompatible syntax, so a
 * single shared file cannot carry a secret for all of them:
 *   Claude Code  ${VAR} and ${VAR:-default}
 *   Cursor       ${env:VAR}, no documented default support
 *   opencode     {env:VAR}, no documented default support
 *
 * The canonical file is written in Claude Code's syntax because it is the only
 * one expressive enough to carry defaults. Targets without default support get
 * the default inlined, so a value stays overridable where it can be and still
 * works out of the box where it cannot.
 */

import { lstatSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type StdioServer = { command: string; args?: string[] };
type HttpServer = { type: string; url: string; headers?: Record<string, string> };
type Server = StdioServer | HttpServer;
type ServerMap = Record<string, Server>;

const root = process.cwd();
const sourcePath = join(root, ".agents/mcp.json");
const placeholder = /\$\{([A-Z0-9_]+)(?::-([^}]*))?\}/g;

function isHttp(server: Server): server is HttpServer {
  return "url" in server;
}

function inlineDefaults(value: string, toReference: (name: string) => string): string {
  return value.replace(placeholder, (_match, name: string, fallback?: string) =>
    fallback === undefined ? toReference(name) : fallback
  );
}

function rewriteDeep<T>(value: T, toReference: (name: string) => string): T {
  if (typeof value === "string") return inlineDefaults(value, toReference) as T;
  if (Array.isArray(value)) {
    return value.map((item) => rewriteDeep(item, toReference)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        rewriteDeep(nested, toReference),
      ])
    ) as T;
  }
  return value;
}

function toOpencodeServer(server: Server) {
  const converted = rewriteDeep(server, (variable) => `{env:${variable}}`);

  if (isHttp(converted)) {
    return {
      type: "remote",
      url: converted.url,
      enabled: true,
      ...(converted.headers ? { headers: converted.headers } : {}),
    };
  }

  return {
    type: "local",
    command: [converted.command, ...(converted.args ?? [])],
    enabled: true,
  };
}

function toOpencode(servers: ServerMap) {
  return {
    $schema: "https://opencode.ai/config.json",
    mcp: Object.fromEntries(
      Object.entries(servers).map(([name, server]) => [name, toOpencodeServer(server)])
    ),
  };
}

function replaceSymlink(absolutePath: string): void {
  try {
    if (lstatSync(absolutePath).isSymbolicLink()) unlinkSync(absolutePath);
  } catch {
    // Nothing at that path yet — writing creates it.
  }
}

function write(relativePath: string, payload: unknown): void {
  const absolutePath = join(root, relativePath);
  replaceSymlink(absolutePath);
  writeFileSync(absolutePath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`  ✓ ${relativePath}`);
}

const source = (await Bun.file(sourcePath).json()) as { mcpServers: ServerMap };
const servers = source.mcpServers;

console.log("Generating agent MCP configs from .agents/mcp.json:");

write(".mcp.json", { mcpServers: servers });
write(".cursor/mcp.json", {
  mcpServers: rewriteDeep(servers, (variable) => `\${env:${variable}}`),
});
write("opencode.json", toOpencode(servers));

console.log("\nRun this again after editing .agents/mcp.json.");

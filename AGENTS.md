This application is a Next.js starter kit that helps you build modern web applications faster and easier than ever before.

## Architecture

The starter kit is built with the following stack:
- Bun.js
- Prisma
- Next.js
- Tailwind CSS
- Shadcn UI
- tRPC
- Husky
- Biome
- Better Auth
- Stripe
- Zod
- Winston

Folder structure:

```bash
src/                      # Source root
  app/                    # Next.js app directory
  components/             # Next.js components
  components/ui/          # Shadcn UI components
  hooks/                  # React hooks
  lib/                    # Library functions
  lib/queries/            # Client-side React Query hooks (optimistic updates, cache management)
  lib/actions/            # Next.js server actions (called from mutations)
  lib/dao/                # Database access layer (Prisma queries, called from tRPC and actions)
  lib/trpc/routers/       # tRPC route definitions (called from React Query hooks)
  lib/contexts/           # React contexts
  types/                  # TypeScript types
```

### Data flow layers

Client-side data flows through these layers (top to bottom):

2. **React Query hooks** (`lib/queries/`) — cached server state with optimistic updates
3. **tRPC routes** (`lib/trpc/routers/`) — server endpoints for reads
4. **Server actions** (`lib/actions/`) — server endpoints for writes
5. **DAOs** (`lib/dao/`) — Prisma database queries

**CRITICAL RULE - Data Fetching:**
- React Query hooks (`lib/queries/`) MUST fetch data through **tRPC only** - never import DAO functions directly
- Use `useTRPC()` hook and call tRPC procedures (e.g., `trpc.projects.queryOptions()`)
- DAO functions are for tRPC routes and server actions only
- Server actions (`lib/actions/`) can call DAO functions directly for writes
- Violating this breaks the application as DAO functions are `server-only` and cannot be imported directly in client-side code.

### Client-side caching

React Query cache is persisted to **IndexedDB** (key: `"catalyst-query-cache"`) via
`lib/trpc/query-persister.ts`, so data survives page reloads. Configuration is in
`lib/trpc/query-client.ts` (`staleTime: 15s`, `refetchOnMount: false`). Queries opt out of
persistence with `meta: { persist: false }`.

### Server-side data loading

When a page needs multiple server-side queries, do NOT `Promise.all` them and block rendering
until all resolve. Instead:

1. `await` only the fast/critical query directly (e.g., lightweight metadata).
2. Wrap heavier queries in inline async server components, each inside a `<Suspense>` boundary
   with a skeleton fallback.
3. Create skeleton components (`Skeleton` from `components/ui/skeleton`) that match the real
   content's dimensions to avoid layout shifts when data streams in.

This lets the shell render instantly while expensive data streams in progressively.

## Creating and using components

By default, rely on preinstalled Shadcn UI components. If you cannot find a matching component,
use the `shadcn` MCP tool to find and install the missing component.

## Coding guidelines

- Use `bun` and `bunx` as package manager and CLI tool respectively.
- DO NOT write docstrings for functions or classes unless explicitly asked to do so.
- DO NOT write unnecessary comments like "Returns the user's name" for a function named `getName`.
- Only write comments for complex logic or when it's not obvious what the code does.
- Linter, formatter, and type checker are automatically executed after writing code.
  - Fix any errors or warnings until the code passes the checks.
- Install new dependencies with `bun add <package> --exact`, meaning the exact version of the package.
  - If a dependency is installed with ^, install that exact version and remove the ^.
- Write prisma functions in `/src/lib/dao/`. Nothing outside that folder may import the prisma
  client — `src/auth.ts` is the only exception, because Better Auth's `prismaAdapter` takes the
  client instance itself. The `arch.imports` rule in `klint.yaml` enforces this, so a stray
  import fails `bun run klint`. Before implementing a database query, check if it already
  exists in the `dao` folder. If it does, use it. If it doesn't, create a new function in the
  `dao` folder, then import and use it wherever needed.
- Session access lives in `src/lib/session.ts` (`getUserFromSession`, `getUserIdFromSession`).
  Pass the resulting `userId` into DAO functions explicitly — DAO functions must never read the
  session themselves, since `headers()` would make them request-bound and unusable from
  webhooks or cron.

## MCP server (read-only)

The app exposes a read-only MCP server at `POST /api/mcp` so external agents can query the
hosted database. It is stateless Streamable HTTP (`mcp-handler`), so any client that speaks
Streamable HTTP and can set a header connects directly — no stdio bridge.

- **Auth is a Better Auth API key** sent as `Authorization: Bearer <key>`. Users mint keys in
  settings; `src/lib/mcp/auth.ts` resolves the bearer token to a `userId` and returns it as
  `AuthInfo.extra.userId`. That resolver is the single place an OAuth branch would be added —
  the claude.ai connector UI needs OAuth, an API key alone will not connect there.
- **A throttled key gets `429` with `Retry-After`, not `401`.** Each key carries its own limit
  (120 requests / 60s, copied onto the row at creation). `withMcpAuth` can only answer 401/403,
  so `route.ts` verifies the token itself and returns the 429 before delegating — an invalid or
  absent token still gets the standard 401 challenge from `withMcpAuth`.
- **`src/lib/mcp/registry.ts` is the access control.** A model is invisible unless listed, and a
  column is invisible unless it appears in that model's `fields`. Auth tables and
  `User.password` are absent by omission, not filtered out later. To expose a new model, add it
  to the registry and its Prisma delegate to `readDelegates` in `src/lib/dao/mcp.ts` — scoping,
  limit clamping, and field masking come for free.
- **Scoping is enforced in the DAO**, never by the caller: every query merges
  `{ [scope.column]: userId }` into `where`. Filters are compiled field-by-field against the
  allowlist, so a caller cannot reach the scope column or pass a raw `where`. Single-record
  reads `AND` the requested id with the scope predicate instead of merging — on `User` the
  scope column *is* `id`, so a merge would silently overwrite the id being looked up.
- Tools: `list_tables`, `describe_table`, `query_table`, `get_record`, plus a `catalyst://schema`
  resource. Page size defaults to 25 and is capped at 100.
- Writes are deliberately absent — `ReadDelegate` exposes only `findMany`/`findFirst`/`count`.

### Connecting an agent

`.agents/mcp.json` is the **canonical** MCP config. Do not edit `.mcp.json`,
`.cursor/mcp.json`, or `opencode.json` directly — they are generated:

```bash
bun run mcp:sync
```

The three agents expand environment variables with incompatible syntax, which is why one
shared file cannot serve them: Claude Code uses `${VAR}` and `${VAR:-default}`, Cursor uses
`${env:VAR}`, opencode uses `{env:VAR}`. Write the canonical file in Claude Code's syntax —
it is the only one that supports defaults — and the generator inlines each default for the
targets that lack them, while keeping secrets as per-agent variable references.

There is one entry per environment — `catalyst-dev`, `catalyst-stage`, `catalyst-prod` — so
an agent can reach any of them (or several at once) without swapping variables. No server
change is needed: every deployment already serves `/api/mcp` against its own database, and
keys live per-env, so targeting an environment is only a matter of which key you export. The
`dev` URL defaults to `localhost:3000`; `stage`/`prod` carry `example.com` placeholder
defaults — replace them with your real domains (or set `CATALYST_MCP_URL_STAGE` /
`CATALYST_MCP_URL_PROD`) once you deploy.

Expansion reads your **shell** environment, not the repo's `.env`. `bun` auto-loads `.env`,
Claude Code does not, so export the key for each env you use (or bridge it with `direnv`).
Mint a key in that environment's own `/settings`, since keys are scoped to their database:

```bash
export CATALYST_MCP_KEY_DEV="paste-the-key-from-settings-once"
export CATALYST_MCP_KEY_STAGE="..."
export CATALYST_MCP_KEY_PROD="..."
```

An unset key is not a hard failure — the literal `${VAR}` text is sent as the token, which
surfaces as a 401 on that one entry rather than a config error, leaving the others usable.
Check with `claude mcp list`.

## Visual checks & browser automation

- Prefer the **`/playwright-cli`** skill (drives the `playwright-cli` binary) for screenshots, responsive checks, and browser automation. Use the Playwright MCP (`browser_*` tools) only as a fallback when `playwright-cli` is unavailable, or for DOM-metric probing (`browser_evaluate`).
- Never write screenshots/PDFs to the repo root. Output folders (both gitignored):
  - `/playwright-cli` → `.playwright-cli/`. A default-named `playwright-cli screenshot` auto-saves there; with an explicit name keep it under the folder (`--filename=.playwright-cli/<name>.png`) — a bare relative name lands in root.
  - Playwright MCP → `.playwright-mcp/` (enforced via `--output-dir` in `.mcp.json`; use relative `filename`s).

## Shipping

- After a push, use a **`ship-*`** skill to verify the deploy end-to-end before proposing a PR into `main`. This repo deploys to Coolify, so use **`/ship-coolify`**. It waits for GitHub CI, then the `deploy` workflow run for that commit, then the Coolify deployment it triggered (`status=="finished"`), and does a visual check.
- The platform-agnostic orchestration lives in `scripts/ship/core.ts`; each platform is a thin provider (`scripts/ship/coolify.ts`). Run the poller directly: `bun scripts/ship/coolify.ts [--sha=<sha>] [--env=stage|production] [--app=<uuid>] [--no-ci]`. Exit `0` + `{"ok":true}` means deployed; non-zero + `{"ok":false,"error":...}` means a gate failed — surface the error verbatim.
- Needs `COOLIFY_BASE_URL`, `COOLIFY_ACCESS_TOKEN`, and an app UUID (`COOLIFY_APP_UUID_<ENV>` or `COOLIFY_APP_UUID`) in `.env` — gitignored, and `bun` auto-loads it, so the scripts pick it up with no shell setup. See `.env.sample`. Also needs an authenticated `gh`. Nothing about your instance is committed — the `/ship-coolify` skill also doubles as the Coolify REST API reference.
- Deployment itself is CI's job: `.github/workflows/deploy.yml` runs on `workflow_run` after `build` succeeds on `main` and hits the Coolify deploy webhook. It is gated on the `COOLIFY_WEBHOOK` variable in the `Production` environment (plus a repo-level `COOLIFY_TOKEN` secret) — unset means the step skips, so forks are unaffected. Same mechanism as `letterbox`.
- Stop once the environment is deployed **and** visually checked. Never open the PR into `main` automatically — that's the user's call.

## Code organization

- Keep contexts in `/src/lib/contexts/` folder, hooks in `/src/hooks/` folder, and utils in `/src/lib/utils/` folder.
- Extract helper functions with no component dependencies to `/src/lib/utils/` or `/src/lib/` subfolders.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

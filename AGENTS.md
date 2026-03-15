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
- Write prisma functions in `/src/lib/dao/` or `src/lib/actions/` folders. Never import
  `prisma` directly in route handlers or components. Before implementing a database query,
  check if it already exists in the `dao` folder. If it does, use it. If it doesn't, create
  a new function in the `dao` folder, then import and use it wherever needed.

## Code organization

- Keep contexts in `/src/lib/contexts/` folder, hooks in `/src/hooks/` folder, and utils in `/src/lib/utils/` folder.
- Extract helper functions with no component dependencies to `/src/lib/utils/` or `/src/lib/` subfolders.

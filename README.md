# <img src="src/app/icon.svg" alt="" width="28" height="28" /> Catalyst

![GitHub Workflow Status](https://github.com/kovrichard/catalyst/actions/workflows/build.yml/badge.svg)

Build your product, not your setup. The Next.js starter where your agent reviews itself and your
app speaks MCP from day one.

https://github.com/user-attachments/assets/b9d199c8-50ea-42f1-8d9f-d833b95aa91f

## Why Catalyst

**Your agent checks its own work.** Eight checks run the moment your agent stops: Biome, tsc,
knip, jscpd, klint, madge, line endings, and secretlint. A failure goes back to the agent with the
reason attached, so you review a green diff. The same checks run again before every commit and in
CI.

**Architecture as code.** klint turns the rules in AGENTS.md into build failures. Prisma outside
the DAO, raw radix-ui, or a template-literal className fails the check instead of waiting in
review.

**One setup, every agent.** AGENTS.md, the hooks, and the skills work in Claude Code, Cursor,
Codex, and OpenCode.

**Agent-ready from day one.** A read-only MCP server at `/api/mcp` with API keys, per-key rate
limits, user scoping, and a field allowlist. You list models, Catalyst handles the rest.

**Keep only what you need.** `bun run configure` removes auth, the database, email, MCP, Redis,
storage, Stripe, or tRPC cleanly.

## Stack

[Next.js](https://nextjs.org) · [Bun](https://bun.sh) · [Prisma](https://www.prisma.io) ·
[tRPC](https://trpc.io) · [Tailwind CSS](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com) ·
[Better Auth](https://www.better-auth.com) · [Stripe](https://stripe.com) · [Zod](https://zod.dev) ·
[Winston](https://github.com/winstonjs/winston) · [Amazon S3](https://aws.amazon.com/s3/) ·
[Amazon SES](https://aws.amazon.com/ses/) · [React Email](https://react.email) ·
[Redis](https://redis.io) · [pgBouncer](https://www.pgbouncer.org) · [Docker](https://www.docker.com) ·
[GitHub Actions](https://github.com/features/actions)

## Getting Started

### Prerequisites

Ensure that you have the following tools installed on your machine:

- [Bun](https://bun.sh): Install Bun via the command line by running:

```bash
curl -fsSL https://bun.sh/install | bash
```

or

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

Or if you prefer, you can use other package managers like npm, yarn, or pnpm.

### Development

Install the dependencies, then remove the features you don't need:

```bash
bun install
bun run configure
```

Copy the [`.env.sample`](.env.sample) file to `.env` to set up the environment variables. Then, run the development server:

```bash
bun dev
# or
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying [`src/app/(public)/page.tsx`](<src/app/(public)/page.tsx>). The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Docker

To start the development server using Docker, run:

```bash
make build
make dev
```

If you'd like to start the production server using Docker:

1. Set `output` to `standalone` in the [next.config.mjs](next.config.mjs) file.
2. Set the `AUTH_TRUST_HOST` environment variable to `true` in the [`.env.sample`](.env.sample?plain=1#L31) file.
3. Set the `AUTH_URL` environment variable to the URL of your application in the [`.env.sample`](.env.sample?plain=1#L32) file.
4. Build the project: `make build`
5. Start the production server: `make prod`

## Database

The Catalyst starter kit uses Prisma to interact with the database. By default, it uses PostgreSQL as the database engine.

To set up a local database for development, you can use Docker:

```bash
docker compose up -d
```

This command starts a PostgreSQL database in a Docker container and lets it run in the background.

You can find the database connection URL in the [`.env.sample`](.env.sample?plain=1#L38) file.

You can connect to the database with the following command:

```bash
docker compose exec database psql -U app_dev -d dev
```

Or, if you have `make` installed, you can use the following command:

```bash
make db
```

There is already a `User` model defined in [`prisma/schema.prisma`](prisma/schema.prisma). The correspondent migration file is located in [`prisma/migrations/`](prisma/migrations/). To create the database schema and generate the Prisma client, run:

```bash
bun run migrate
```

## Authentication

The Catalyst starter kit uses Better Auth for authentication. You can find the authentication logic in [`src/auth.ts`](src/auth.ts).

By default, a development secret is already set in the [`.env.sample`](.env.sample?plain=1#L26) file called `AUTH_SECRET`. Set this secret to a more secure random string at the hosting provider of your choice when deploying the application.

If you also need Google login, add your Google OAuth client ID and secret to the [`.env`](.env.sample?plain=1#L29) file.

All of these environment variables have placeholders if you copied the [`.env.sample`](.env.sample) file.

## MCP server (read-only)

Catalyst exposes a read-only [MCP](https://modelcontextprotocol.io) server at `POST /api/mcp`, so external agents can query your hosted database directly. It is stateless Streamable HTTP, so any client that speaks the protocol and can set a header connects with no stdio bridge.

Authentication is a Better Auth API key sent as `Authorization: Bearer <key>`. Users mint keys in settings, and each key carries its own rate limit. A throttled key gets a `429` with `Retry-After`, not a misleading `401`.

Access is defined by an allowlist in [`src/lib/mcp/registry.ts`](src/lib/mcp/registry.ts): a model is invisible unless it is listed, and a column is invisible unless it appears in that model's fields. Every query is scoped to the caller's own rows inside the DAO, never by the caller, so auth tables and columns like `User.password` are absent by omission.

Four tools are available: `list_tables`, `describe_table`, `query_table`, and `get_record`, plus a `catalyst://schema` resource. Writes are deliberately absent.

The config ships one entry per environment — `catalyst-dev`, `catalyst-stage`, and
`catalyst-prod` — so an agent can reach any of them without swapping variables. `dev` defaults
to `localhost:3000`; `stage` and `prod` carry `example.com` placeholder URLs, so point them at
your real domains (or set `CATALYST_MCP_URL_STAGE` / `CATALYST_MCP_URL_PROD`) once you deploy.

To connect an agent, mint a key in that environment's settings, export it, and sync the
generated config for Claude Code, Cursor, and opencode:

```bash
export CATALYST_MCP_KEY_DEV="paste-the-key-from-settings-once"
bun run mcp:sync
```

## CI/CD

This project uses GitHub Actions for continuous integration and deployment. An example workflow is defined in [`.github/workflows/build.yml`](.github/workflows/build.yml).
It installs the dependencies, lints the code, and builds the project.

## SEO

The project is configured to have a `robots.txt`, a `sitemap.xml`, and a `manifest.webmanifest` file. However, these files cannot be found directly in the repository. Instead, you can find TypeScript files with similar names in the [`src/app`](src/app) directory. Edit them to fit your app. These files use the [Metadata API from Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata).

Set the `NEXT_PUBLIC_AUTHORITY` environment variable in the [`.env`](.env.sample?plain=1#L5) file to the domain of your application. This variable is used in the `robots.txt` and `sitemap.xml` files.

It also sets various SEO-related tags in the root [`layout.tsx`](src/app/layout.tsx) file. Modify and extend these tags to fit your application's needs.

## File storage

User uploads live in S3 under a `<userId>/<fileId>` key, so ownership is encoded in the key
itself. The browser PUTs bytes straight to a presigned URL — they never transit the server.

Set `AWS_S3_BUCKET` (plus the shared `AWS_REGION` / `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`)
to enable storage. Without them `conf.s3Configured` stays false and every read operation returns
`null` instead of throwing, so the app runs unconfigured.

Reads go through [`/api/files/<key>`](src/app/api/files/), which checks the session user owns the
key and then redirects to a freshly signed, short-lived CloudFront URL. Clients persist that
stable path rather than a time-bound URL, so links never go stale. Signing needs
`AWS_CLOUDFRONT_KEY_PAIR_ID`, `AWS_CLOUDFRONT_PRIVATE_KEY_BASE64`, and
`AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN`; with any of them unset the route answers `404`.

Call `createUploadUrls(count)` from [`src/lib/actions/uploads.ts`](src/lib/actions/uploads.ts) to
mint upload targets. The primitives themselves (`putObject`, `getObjectBytes`, `getObjectSize`,
`deleteObject`, `deleteObjectsUnderPrefix`, `copyObject`) are in
[`src/lib/storage/s3.ts`](src/lib/storage/s3.ts).

## Payments

The Catalyst starter kit uses Stripe for payment processing. The [`/api/stripe`](src/app/api/stripe/route.ts) endpoint is used to receive webhook events from Stripe. To enable this endpoint, set the `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` environment variables in the [`.env`](.env.sample?plain=1#L33) file.

In Stripe, set the webhook URL to `https://your-app-url/api/stripe`.

### Events

An example event handler is already set up for the `customer.subscription.updated` event. This event is triggered when a subscription is updated and is used in most subscription-based applications.

Configure the [endpoint](src/app/api/stripe/route.ts?plain=1#L26) to listen for the events you need. To to this, extend the logic of the `switch` statement with the cases for the events you want to handle.

### Billing Portal

For ease of use, we suggest not to reinvent the wheel and use the [Stripe Billing Portal](https://docs.stripe.com/customer-management) to allow your users to manage their subscriptions. The Catalyst starter kit already has a helper function defined in [`src/lib/stripe.ts`](src/lib/stripe.ts?plain=1#L9) to create a session for the billing portal.

The helper function can only be used on the server side and ensures that the user is authenticated before creating the session. It has a single parameter: the Stripe `customerId` of the user.

As the example dashboard of Catalyst can be found at `/dashboard`, the return URL of the billing portal is `http://localhost:3000/dashboard` by default. You can change this to any URL by setting the `STRIPE_PORTAL_RETURN_URL` environment variable in the [`.env`](.env.sample?plain=1#L35) file.

## Logging

Catalyst uses Winston as the default logger and the default log level is `info`. You can change this by setting the `LOG_LEVEL` environment variable in the [`.env`](.env.sample?plain=1#L22) file.

If you want to configure a log drain, set the `LOG_DRAIN_URL` environment variable in the [`.env`](.env.sample?plain=1#L23) file. This will send the logs to the specified URL as well as to the console.

## Analytics

Set the `GOOGLE_ANALYTICS_ID` and/or `GOOGLE_TAG_MANAGER_ID` environment variables in the [`.env`](.env.sample?plain=1#L11) file to enable Google Analytics and/or Google Tag Manager.

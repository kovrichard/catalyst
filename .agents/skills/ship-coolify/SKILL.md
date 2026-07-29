---
name: ship-coolify
description: Verify a Coolify deploy end-to-end after a push — wait for GitHub CI, then the Coolify deployment, confirm the commit is live, and run a visual check. Also the reference for Coolify's REST API. Use when shipping to a Coolify environment, checking a Coolify deploy, or querying Coolify directly.
allowed-tools: Bash(bun scripts/ship/coolify.ts:*) Bash(curl:*) Bash(playwright-cli open:*) Bash(playwright-cli screenshot:*) Bash(playwright-cli close-all:*)
---

# Ship verification — Coolify

Watches a commit from push → GitHub CI → Coolify deployment → live, then visually confirms the site renders. Report anything broken; stop once the deploy is live **and** you've eyeballed it.

This is the Coolify member of the `ship-*` family. The platform-agnostic orchestration (CI gate, poll loop, result contract) lives in `scripts/ship/core.ts`; this skill's probe is `scripts/ship/coolify.ts`.

## Prerequisites

Everything is read from the environment — **nothing about your instance is committed to this repo.**

| Variable | Required | Purpose |
|---|---|---|
| `COOLIFY_BASE_URL` | yes | Instance root, no trailing `/api/v1` (e.g. `https://coolify.example.net`) |
| `COOLIFY_ACCESS_TOKEN` | yes | API token — Coolify → `Keys & Tokens` → `API tokens` |
| `COOLIFY_APP_UUID_<ENV>` | one of | Per-environment app UUID, e.g. `COOLIFY_APP_UUID_STAGE` |
| `COOLIFY_APP_UUID` | one of | Fallback when no per-environment UUID is set |

Put them in **`.env`** (see `.env.sample`). It is gitignored and secretlint-ignored, and `bun` auto-loads it from the project root, so `scripts/ship/coolify.ts` picks them up with no shell setup at all. Values stay scoped to this repo, which matters because each project is a different Coolify app.

This works identically in Claude Code, Cursor, Codex, Copilot, and opencode — no per-agent MCP config and no incompatible substitution syntax.

For raw `curl` in a shell, `.env` is not loaded automatically — source it first:

```bash
set -a; source .env; set +a
```

Also needs `gh` authenticated (for the CI gate) and `playwright-cli` available — always open with `--browser=chromium` (see AGENTS.md).

## Steps

1. **Know the commit.** The SHA under test is the one pushed (defaults to `git rev-parse HEAD`).

2. **Run the poller** — it blocks until CI + deployment are done, or fails fast:

   ```bash
   bun scripts/ship/coolify.ts                     # verify current HEAD on stage
   bun scripts/ship/coolify.ts --sha=<sha>
   bun scripts/ship/coolify.ts --env=production --branch=main
   bun scripts/ship/coolify.ts --app=<uuid>        # explicit app override
   bun scripts/ship/coolify.ts --no-ci             # skip the GitHub CI gate
   ```

   It gates on, in order: GitHub CI `conclusion==success` → the `deploy` workflow run for that SHA concluding `success` → the Coolify deployment it triggered reaching `status=="finished"`. Exit `0` with a final `{"ok":true,...}` line means it's deployed. Non-zero + `{"ok":false,"error":...}` means it broke — surface the error verbatim.

   **Why three gates and not two.** The app uses the `dockerimage` build pack, so Coolify pulls a prebuilt image and never learns which commit it is running — every deployment record reads `commit: "HEAD"`. The `deploy` workflow run is the only thing that ties a commit to a deployment, since it fires the webhook solely for its own SHA. Its success alone is not enough either: the webhook returns as soon as Coolify *queues* the build, so the run can go green while the deployment is still building or about to fail. The poller therefore uses the run's start time to pick out the deployment it triggered, then waits on that deployment's real status.

3. **Visual check** (only after the poller succeeds) — use the environment's URL:

   ```bash
   playwright-cli open --browser=chromium <url>
   playwright-cli screenshot --filename=.playwright-cli/ship-coolify.png
   playwright-cli close-all
   ```

   `Read` the PNG. Confirm the page renders (nav, hero, no obvious breakage) and note the console error count from the `open` output.

4. **Report.** State: commit shipped, deployment status, deployment UUID, and the visual result. If this is a first live run or anything looks off, call it out explicitly. Do **not** open the PR into main — that's the user's call.

## Stop condition

Stop when the poller returns `ok:true` **and** you've done the visual check. If the poller fails at any gate, stop and report the exact failure (which gate, which run/deployment id) instead of pushing on.

## Coolify REST API reference

Base URL is `$COOLIFY_BASE_URL/api/v1`. Auth is a bearer token on every request. Source `.env` first so the variables resolve in the shell:

```bash
set -a; source .env; set +a
curl -s -H "Authorization: Bearer $COOLIFY_ACCESS_TOKEN" \
  "$COOLIFY_BASE_URL/api/v1/applications"
```

Never echo the token, and never paste a resolved URL or UUID into a committed file.

### Endpoints worth knowing

| Method | Path | Use |
|---|---|---|
| `GET` | `/health` | Liveness probe |
| `GET` | `/version` | Instance version |
| `GET` | `/applications` | List apps — **this is how you discover a UUID instead of hardcoding one** |
| `GET` | `/applications/{uuid}` | App detail |
| `GET` | `/applications/{uuid}/logs` | Container logs |
| `POST` | `/applications/{uuid}/restart` | Restart |
| `GET` | `/deployments` | Currently running deployments only |
| `GET` | `/deployments/applications/{uuid}?take=N` | Deployment history for one app |
| `GET` | `/deployments/{uuid}` | One deployment by UUID |
| `POST` | `/deployments/{uuid}/cancel` | Cancel a running deployment |
| `POST` | `/deploy?uuid=<uuid>&force=<bool>` | Trigger a deploy (`tag`, `pr` also accepted) |

### Deployment record

`GET /deployments/{uuid}` returns an `ApplicationDeploymentQueue`. The fields that matter for shipping:

- `commit` — the git SHA, **but only for git-based build packs**. On a `dockerimage` app (this repo) it is always the literal string `"HEAD"`, so it cannot be used to identify a push.
- `created_at` — the key this repo correlates against, bounded by the `deploy` workflow run's start time
- `status` — see enum below
- `deployment_uuid`, `application_name`, `commit_message`, `server_name`
- `logs` — build output, useful when a deploy fails
- `created_at` / `updated_at`

### Status enum

Verified against `app/Enums/ApplicationDeploymentStatus.php`:

| Value | Meaning |
|---|---|
| `queued` | Waiting to start — keep polling |
| `in_progress` | Building/deploying — keep polling |
| `finished` | **Success** |
| `failed` | Terminal failure |
| `cancelled-by-user` | Terminal, user-initiated |

`finished` is the only success value. Treat `failed` and `cancelled-by-user` as terminal and stop polling.

### Finding an app UUID without hardcoding it

```bash
set -a; source .env; set +a
curl -s -H "Authorization: Bearer $COOLIFY_ACCESS_TOKEN" \
  "$COOLIFY_BASE_URL/api/v1/applications" \
  | jq -r '.[] | "\(.uuid)  \(.name)"'
```

Take the UUID, add it to `.env` as `COOLIFY_APP_UUID_<ENV>`, and the poller resolves it automatically.

## Notes

- `scripts/ship/coolify.ts` hardcodes no host, app name, or UUID — everything resolves from env or `--app=`, so this skill ships unchanged to any fork.
- Coolify's published OpenAPI declares `GET /deployments/applications/{uuid}` as returning `Application[]`; the running API returns deployment records, sometimes wrapped. The provider normalizes bare arrays, `{deployments:[…]}`, and `{data:[…]}`.
- SHA matching is prefix-tolerant in both directions — Coolify may store either a short or full commit hash.

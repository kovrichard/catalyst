import { execSync } from "node:child_process";

export const POLL_MS = 10_000;
export const CI_TIMEOUT_MS = 12 * 60_000;
export const DEPLOY_TIMEOUT_MS = 12 * 60_000;

export type ShipArgs = {
  sha: string;
  branch: string;
  env: string;
  ciWorkflow: string;
  skipCi: boolean;
  extra: Record<string, string>;
};

export type DeployStatus =
  | { state: "pending"; detail: string }
  | { state: "failed"; detail: string }
  | { state: "success"; meta: Record<string, unknown> };

export type ShipProvider = {
  name: string;
  checkDeploy: (sha: string, args: ShipArgs) => Promise<DeployStatus>;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function sh(cmd: string): string {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

export function log(step: string, message: string): void {
  console.log(`[ship] ${step}: ${message}`);
}

export function fail(message: string): never {
  console.log(`[ship] error: ${message}`);
  console.log(JSON.stringify({ ok: false, error: message }));
  process.exit(1);
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    fail(
      `Missing ${name}. Add it to .env (gitignored, auto-loaded by bun) or export it.`
    );
  }
  return value as string;
}

const KNOWN_FLAGS = new Set(["--sha", "--branch", "--env", "--ci-workflow", "--no-ci"]);

export function parseArgs(): ShipArgs {
  const argv = process.argv.slice(2);
  const get = (flag: string) => {
    const hit = argv.find((a) => a.startsWith(`${flag}=`));
    return hit ? hit.slice(flag.length + 1) : undefined;
  };
  const extra: Record<string, string> = {};
  for (const arg of argv) {
    if (!arg.startsWith("--") || !arg.includes("=")) continue;
    const key = arg.slice(0, arg.indexOf("="));
    if (KNOWN_FLAGS.has(key)) continue;
    extra[key.slice(2)] = arg.slice(arg.indexOf("=") + 1);
  }
  const positionalSha = argv.find((a) => !a.startsWith("--"));
  return {
    sha: get("--sha") ?? positionalSha ?? sh("git rev-parse HEAD"),
    branch: get("--branch") ?? "stage",
    env: get("--env") ?? "stage",
    ciWorkflow: get("--ci-workflow") ?? "build",
    skipCi: argv.includes("--no-ci"),
    extra,
  };
}

type CiRun = {
  databaseId: number;
  headSha: string;
  status: string;
  conclusion: string;
};

export function parseJson<T>(raw: string, source: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fail(`Could not parse ${source} as JSON: ${raw.slice(0, 200)}`);
  }
}

// `gh run list` is newest-first and a branch usually carries several workflows,
// so the run must be pinned to the CI workflow by name — otherwise a later
// workflow for the same commit wins the lookup and gets mistaken for CI.
async function waitForCi(sha: string, branch: string, workflow: string): Promise<void> {
  const deadline = Date.now() + CI_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const runs = parseJson<CiRun[]>(
      sh(
        `gh run list --branch ${branch} --workflow ${workflow} --limit 20 --json databaseId,headSha,status,conclusion,workflowName`
      ),
      `"gh run list --workflow ${workflow}" output`
    );
    const run = runs.find((r) => r.headSha.startsWith(sha) || sha.startsWith(r.headSha));
    if (!run) {
      log("ci", `no run for ${sha.slice(0, 7)} yet…`);
    } else if (run.status !== "completed") {
      log("ci", `run ${run.databaseId} ${run.status}…`);
    } else if (run.conclusion !== "success") {
      fail(`GitHub CI concluded "${run.conclusion}" (run ${run.databaseId})`);
    } else {
      log("ci", `success (run ${run.databaseId})`);
      return;
    }
    await sleep(POLL_MS);
  }
  fail("Timed out waiting for GitHub CI");
}

export async function runShip(provider: ShipProvider): Promise<void> {
  const args = parseArgs();
  log(
    "start",
    `provider=${provider.name} sha=${args.sha.slice(0, 7)} env=${args.env} branch=${args.branch}`
  );

  if (args.skipCi) {
    log("ci", "skipped (--no-ci)");
  } else {
    await waitForCi(args.sha, args.branch, args.ciWorkflow);
  }

  const deadline = Date.now() + DEPLOY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const status = await provider.checkDeploy(args.sha, args);
    if (status.state === "pending") {
      log("deploy", status.detail);
      await sleep(POLL_MS);
      continue;
    }
    if (status.state === "failed") {
      fail(status.detail);
    }
    log("deploy", "success");
    log("done", `${args.env} is serving ${args.sha.slice(0, 7)} — deploy successful`);
    console.log(
      JSON.stringify({ ok: true, provider: provider.name, sha: args.sha, ...status.meta })
    );
    return;
  }
  fail(`Timed out waiting for ${provider.name} deploy`);
}

#!/usr/bin/env bun

import {
  type DeployStatus,
  fail,
  parseJson,
  requireEnv,
  runShip,
  type ShipArgs,
  type ShipProvider,
  sh,
} from "./core";

const baseUrl = requireEnv("COOLIFY_BASE_URL").replace(/\/+$/, "");
const token = requireEnv("COOLIFY_ACCESS_TOKEN");

const API = `${baseUrl}/api/v1`;
const DEPLOY_WORKFLOW = "deploy";
const DEPLOYMENT_PAGE_SIZE = 20;
const CLOCK_SKEW_MS = 30_000;

const TERMINAL_FAILURES = new Set(["failed", "cancelled-by-user"]);
const SUCCESS = "finished";

type DeployRun = {
  databaseId: number;
  headSha: string;
  status: string;
  conclusion: string;
  startedAt: string;
};

type DeploymentRecord = {
  deployment_uuid: string;
  status: string;
  created_at: string;
  commit_message?: string;
  server_name?: string;
  updated_at?: string;
};

async function coolify(path: string): Promise<unknown> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    fail(`Coolify API ${path} → ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function appUuidFor(args: ShipArgs): string {
  if (args.extra.app) return args.extra.app;
  const scoped = process.env[`COOLIFY_APP_UUID_${args.env.toUpperCase()}`];
  return scoped ?? requireEnv("COOLIFY_APP_UUID");
}

// Coolify's OpenAPI declares GET /deployments/applications/{uuid} as Application[],
// but the running API returns {count, deployments:[…]}.
function toDeploymentRecords(payload: unknown): DeploymentRecord[] {
  if (Array.isArray(payload)) return payload as DeploymentRecord[];
  const container = (payload ?? {}) as { deployments?: unknown; data?: unknown };
  const list = container.deployments ?? container.data;
  return Array.isArray(list) ? (list as DeploymentRecord[]) : [];
}

// The dockerimage build pack leaves every Coolify deployment record at commit="HEAD",
// so the deploy workflow run is the only commit↔deployment link: it fires the webhook
// for its own sha alone, and its start time bounds which deployment belongs to it.
function deployRunFor(sha: string, branch: string): DeployRun | undefined {
  const runs = parseJson<DeployRun[]>(
    sh(
      `gh run list --branch ${branch} --workflow ${DEPLOY_WORKFLOW} --limit 20 --json databaseId,headSha,status,conclusion,startedAt`
    ),
    `"gh run list --workflow ${DEPLOY_WORKFLOW}" output`
  );
  return runs.find((run) => run.headSha.startsWith(sha) || sha.startsWith(run.headSha));
}

function firstDeploymentAfter(
  records: DeploymentRecord[],
  since: number
): DeploymentRecord | undefined {
  return records
    .filter((record) => Date.parse(record.created_at) >= since)
    .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))[0];
}

const coolifyProvider: ShipProvider = {
  name: "coolify",
  async checkDeploy(sha: string, args: ShipArgs): Promise<DeployStatus> {
    const run = deployRunFor(sha, args.branch);
    if (!run) {
      return {
        state: "pending",
        detail: `no ${DEPLOY_WORKFLOW} run for ${sha.slice(0, 7)} yet…`,
      };
    }
    if (run.status !== "completed") {
      return {
        state: "pending",
        detail: `${DEPLOY_WORKFLOW} run ${run.databaseId} ${run.status}…`,
      };
    }
    if (run.conclusion !== "success") {
      return {
        state: "failed",
        detail: `${DEPLOY_WORKFLOW} run ${run.databaseId} concluded "${run.conclusion}" — the webhook was rejected`,
      };
    }

    const records = toDeploymentRecords(
      await coolify(
        `/deployments/applications/${appUuidFor(args)}?take=${DEPLOYMENT_PAGE_SIZE}`
      )
    );
    const deployment = firstDeploymentAfter(
      records,
      Date.parse(run.startedAt) - CLOCK_SKEW_MS
    );

    if (!deployment) {
      return {
        state: "pending",
        detail: "webhook accepted, waiting for Coolify to register the deployment…",
      };
    }
    if (TERMINAL_FAILURES.has(deployment.status)) {
      return {
        state: "failed",
        detail: `Coolify deployment status="${deployment.status}" (deployment ${deployment.deployment_uuid})`,
      };
    }
    if (deployment.status !== SUCCESS) {
      return { state: "pending", detail: `${deployment.status}…` };
    }

    return {
      state: "success",
      meta: {
        deployWorkflowRun: run.databaseId,
        deploymentUuid: deployment.deployment_uuid,
        status: deployment.status,
        commitMessage: deployment.commit_message,
        serverName: deployment.server_name,
        finishedAt: deployment.updated_at,
      },
    };
  },
};

await runShip(coolifyProvider);

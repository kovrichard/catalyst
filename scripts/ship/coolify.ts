#!/usr/bin/env bun

import {
  type DeployStatus,
  fail,
  requireEnv,
  runShip,
  type ShipArgs,
  type ShipProvider,
} from "./core";

const baseUrl = requireEnv("COOLIFY_BASE_URL").replace(/\/+$/, "");
const token = requireEnv("COOLIFY_ACCESS_TOKEN");

const API = `${baseUrl}/api/v1`;
const DEPLOYMENT_PAGE_SIZE = 20;

type DeploymentRecord = {
  deployment_uuid: string;
  status: string;
  commit?: string;
  commit_message?: string;
  server_name?: string;
  updated_at?: string;
};

const TERMINAL_FAILURES = new Set(["failed", "cancelled-by-user"]);
const SUCCESS = "finished";

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
// but the running API returns deployment records, sometimes wrapped in a container.
function toDeploymentRecords(payload: unknown): DeploymentRecord[] {
  if (Array.isArray(payload)) return payload as DeploymentRecord[];
  const container = (payload ?? {}) as { deployments?: unknown; data?: unknown };
  const list = container.deployments ?? container.data;
  return Array.isArray(list) ? (list as DeploymentRecord[]) : [];
}

function matchesCommit(deployment: DeploymentRecord, sha: string): boolean {
  const commit = deployment.commit;
  if (!commit) return false;
  return commit.startsWith(sha) || sha.startsWith(commit);
}

const coolifyProvider: ShipProvider = {
  name: "coolify",
  async checkDeploy(sha: string, args: ShipArgs): Promise<DeployStatus> {
    const appUuid = appUuidFor(args);
    const records = toDeploymentRecords(
      await coolify(`/deployments/applications/${appUuid}?take=${DEPLOYMENT_PAGE_SIZE}`)
    );
    const deployment = records.find((record) => matchesCommit(record, sha));

    if (!deployment) {
      return {
        state: "pending",
        detail: `no Coolify deployment for ${sha.slice(0, 7)} yet…`,
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
        appUuid,
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

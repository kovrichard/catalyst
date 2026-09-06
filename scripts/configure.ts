#!/usr/bin/env bun

import { spawn } from "node:child_process";
import { Command } from "commander";
import prompts from "prompts";
import { removeAuth } from "./removers/auth";
import { removeDatabase } from "./removers/db";
import { removeEmail } from "./removers/email";
import { removeMcp } from "./removers/mcp";
import { removeRedis } from "./removers/redis";
import { removeStorage } from "./removers/storage";
import { removeStripe } from "./removers/stripe";
import { removeTrpc } from "./removers/trpc";

function runCommand(cmd: string, args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, { stdio: "inherit" });
    proc.on("close", (code) => resolve(code ?? 1));
  });
}

type ConfigOptions = {
  removeStripe?: boolean;
  removeDatabase?: boolean;
  removeRedis?: boolean;
  removeAuth?: boolean;
  removeTrpc?: boolean;
  removeEmail?: boolean;
  removeMcp?: boolean;
  removeStorage?: boolean;
  dryRun?: boolean;
};

type RemovalKey = Exclude<keyof ConfigOptions, "dryRun">;

type Feature = {
  key: RemovalKey;
  flag: string;
  name: string;
  description: string;
  enabled: boolean;
};

const features: Feature[] = [
  {
    key: "removeStripe",
    flag: "stripe",
    name: "Stripe",
    description: "Remove Stripe integration (payments, webhooks, billing portal)",
    enabled: true,
  },
  {
    key: "removeDatabase",
    flag: "database",
    name: "Database & Auth",
    description:
      "Remove database and authentication (Prisma, PostgreSQL, everything in auth)",
    enabled: true,
  },
  {
    key: "removeRedis",
    flag: "redis",
    name: "Redis",
    description: "Remove Redis integration (caching)",
    enabled: true,
  },
  {
    key: "removeAuth",
    flag: "auth",
    name: "Auth",
    description: "Remove authentication (login, register, users, notifications)",
    enabled: true,
  },
  {
    key: "removeTrpc",
    flag: "trpc",
    name: "tRPC",
    description: "Remove tRPC + React Query stack (client, server, routers, packages)",
    enabled: true,
  },
  {
    key: "removeEmail",
    flag: "email",
    name: "Email",
    description: "Remove transactional email (AWS SES, React Email templates)",
    enabled: true,
  },
  {
    key: "removeMcp",
    flag: "mcp",
    name: "MCP",
    description: "Remove the read-only MCP server (API keys, registry, /api/mcp route)",
    enabled: true,
  },
  {
    key: "removeStorage",
    flag: "storage",
    name: "Storage",
    description: "Remove S3 file storage (uploads, presigned URLs, CloudFront signing)",
    enabled: true,
  },
];

async function showSummary(options: ConfigOptions): Promise<void> {
  const removals: string[] = [];
  if (options.removeStripe) {
    removals.push("Stripe");
  }
  if (options.removeDatabase) {
    removals.push("Database");
  }
  if (options.removeRedis) {
    removals.push("Redis");
  }
  if (options.removeAuth) {
    removals.push("Auth");
  }
  if (options.removeTrpc) {
    removals.push("tRPC");
  }
  if (options.removeEmail) {
    removals.push("Email");
  }
  if (options.removeMcp) {
    removals.push("MCP");
  }
  if (options.removeStorage) {
    removals.push("Storage");
  }

  if (removals.length === 0) {
    console.log("\nNo features selected for removal.");
    return;
  }

  if (options.dryRun) {
    console.log("\n🔍 DRY RUN MODE - No files will be modified\n");
  }

  console.log("The following features will be removed:");
  removals.forEach((feature) => {
    console.log(`  - ${feature}`);
  });
  console.log("");
}

async function executeRemovals(options: ConfigOptions): Promise<void> {
  const dryRun = options.dryRun ?? false;

  if (options.removeStripe) {
    await removeStripe(dryRun);
  }
  if (options.removeDatabase) {
    await removeDatabase(dryRun);
  }
  if (options.removeRedis) {
    await removeRedis(dryRun);
  }
  if (options.removeAuth) {
    await removeAuth(dryRun);
  }
  if (options.removeTrpc) {
    await removeTrpc(dryRun);
  }
  if (options.removeEmail) {
    await removeEmail(dryRun);
  }
  if (options.removeMcp) {
    await removeMcp(dryRun);
  }
  if (options.removeStorage) {
    await removeStorage(dryRun);
  }

  if (!dryRun) {
    // Marker stripping leaves indentation/import-order artifacts that biome
    // can resolve in one pass. Run the project's check fixer so the working
    // tree is committable immediately.
    console.log("Running biome check --write to tidy formatting and imports...");
    const exitCode = await runCommand("bunx", ["biome", "check", "--write", "."]);
    if (exitCode !== 0) {
      console.log(
        "  Warning: biome reported issues it could not auto-fix. Review the output above."
      );
    }
  }
}

async function interactiveMode(dryRun = false): Promise<void> {
  console.log(`\n🔧 Catalyst Boilerplate Configuration ${dryRun ? "(DRY RUN)" : ""}\n`);

  const enabledFeatures = features.filter((f) => f.enabled);

  const response = await prompts({
    type: "multiselect",
    name: "features",
    message: "Select features to remove (use space to toggle, enter to confirm):",
    choices: enabledFeatures.map((feature) => ({
      title: feature.name,
      description: feature.description,
      value: feature.key,
    })),
    instructions: false,
  });

  if (!response?.features?.length) {
    console.log("\nNo features selected. Keeping all features.");
    return;
  }

  const options: ConfigOptions = {
    dryRun,
  };
  response.features.forEach((key: keyof ConfigOptions) => {
    options[key] = true;
  });

  await showSummary(options);
  await executeRemovals(options);
}

const featureByFlag = new Map(features.map((feature) => [feature.flag, feature.key]));

function featureFlagList(): string {
  return [...featureByFlag.keys()].join(", ");
}

function applyNegatedFlags(opts: Record<string, unknown>, options: ConfigOptions): void {
  for (const feature of features) {
    if (opts[feature.flag] === false) {
      options[feature.key] = true;
    }
  }
}

function splitFeatureList(entries: string[]): string[] {
  return entries
    .flatMap((entry) => entry.split(","))
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function applyRemoveList(entries: string[], options: ConfigOptions): void {
  for (const entry of splitFeatureList(entries)) {
    const key = featureByFlag.get(entry.toLowerCase());
    if (!key) {
      console.error(`Unknown feature: ${entry}`);
      console.error(`Available features: ${featureFlagList()}`);
      process.exit(1);
    }
    options[key] = true;
  }
}

function parseArgs(): ConfigOptions {
  const program = new Command();

  program
    .name("configure")
    .description("Configure Catalyst boilerplate by removing unused features")
    .version("1.0.0")
    .option("--no-stripe", "Remove Stripe integration")
    .option("--no-database", "Remove database integration")
    .option("--no-redis", "Remove Redis integration")
    .option("--no-auth", "Remove authentication integration")
    .option("--no-trpc", "Remove tRPC + React Query stack")
    .option("--no-email", "Remove transactional email (AWS SES + React Email)")
    .option("--no-mcp", "Remove the read-only MCP server")
    .option("--no-storage", "Remove S3 file storage")
    .option(
      "--remove <features...>",
      `Remove specific features (comma-separated: ${featureFlagList()})`
    )
    .option("--dry-run", "Show what would be done without making changes")
    .parse(process.argv);

  const opts = program.opts<
    Record<string, unknown> & {
      remove?: string[];
      dryRun?: boolean;
    }
  >();

  const options: ConfigOptions = {
    dryRun: opts.dryRun ?? false,
  };

  applyNegatedFlags(opts, options);

  if (opts.remove) {
    applyRemoveList(opts.remove, options);
  }

  return options;
}

async function main(): Promise<void> {
  const options = parseArgs();
  const dryRun = options.dryRun ?? false;

  if (Object.keys(options).filter((k) => k !== "dryRun").length === 0) {
    await interactiveMode(dryRun);
  } else {
    await showSummary(options);
    await executeRemovals(options);
  }
}

try {
  await main();
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}

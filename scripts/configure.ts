#!/usr/bin/env bun

import { Command } from "commander";
import prompts from "prompts";
import { removeAuth } from "./removers/auth";
import { removeRedis } from "./removers/redis";
import { removeStripe } from "./removers/stripe";

interface ConfigOptions {
  removeStripe?: boolean;
  removeRedis?: boolean;
  removeAuth?: boolean;
  dryRun?: boolean;
}

interface Feature {
  key: keyof ConfigOptions;
  name: string;
  description: string;
  enabled: boolean;
}

const features: Feature[] = [
  {
    key: "removeStripe",
    name: "Stripe",
    description: "Remove Stripe integration (payments, webhooks, billing portal)",
    enabled: true,
  },
  {
    key: "removeRedis",
    name: "Redis",
    description: "Remove Redis integration (caching)",
    enabled: true,
  },
  {
    key: "removeAuth",
    name: "Auth",
    description: "Remove authentication (login, register, users, notifications)",
    enabled: true,
  },
];

async function showSummary(options: ConfigOptions): Promise<void> {
  const removals: string[] = [];
  if (options.removeStripe) removals.push("Stripe");
  if (options.removeRedis) removals.push("Redis");
  if (options.removeAuth) removals.push("Auth");

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
  if (options.removeRedis) {
    await removeRedis(dryRun);
  }
  if (options.removeAuth) {
    await removeAuth(dryRun);
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

function parseArgs(): ConfigOptions {
  const program = new Command();

  program
    .name("configure")
    .description("Configure Catalyst boilerplate by removing unused features")
    .version("1.0.0")
    .option("--no-stripe", "Remove Stripe integration")
    .option("--no-redis", "Remove Redis integration")
    .option("--no-auth", "Remove authentication integration")
    .option(
      "--remove <features...>",
      "Remove specific features (comma-separated: stripe, redis, auth)"
    )
    .option("--dry-run", "Show what would be done without making changes")
    .parse(process.argv);

  const opts = program.opts<{
    stripe?: boolean;
    redis?: boolean;
    auth?: boolean;
    remove?: string[];
    dryRun?: boolean;
  }>();

  const options: ConfigOptions = {
    dryRun: opts.dryRun ?? false,
  };

  if (opts.stripe === false) {
    options.removeStripe = true;
  }
  if (opts.redis === false) {
    options.removeRedis = true;
  }
  if (opts.auth === false) {
    options.removeAuth = true;
  }

  if (opts.remove) {
    opts.remove.forEach((featureArg) => {
      const features = featureArg
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
      features.forEach((feature) => {
        const normalized = feature.toLowerCase();
        if (normalized === "stripe") {
          options.removeStripe = true;
        } else if (normalized === "redis") {
          options.removeRedis = true;
        } else if (normalized === "auth") {
          options.removeAuth = true;
        } else {
          console.error(`Unknown feature: ${feature}`);
          console.error("Available features: stripe, redis, auth");
          process.exit(1);
        }
      });
    });
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

#!/usr/bin/env bun

import { Command } from "commander";
import prompts from "prompts";
import { removeAWS } from "./removers/aws";
import { removeRedis } from "./removers/redis";
import { removeStripe } from "./removers/stripe";

interface ConfigOptions {
  removeStripe?: boolean;
  removeRedis?: boolean;
  removeAWS?: boolean;
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
    key: "removeAWS",
    name: "AWS SES",
    description: "Remove AWS SES integration (email sending)",
    enabled: true,
  },
];

async function showSummary(options: ConfigOptions): Promise<void> {
  const removals: string[] = [];
  if (options.removeStripe) removals.push("Stripe");
  if (options.removeRedis) removals.push("Redis");
  if (options.removeAWS) removals.push("AWS SES");

  if (removals.length === 0) {
    console.log("\nNo features selected for removal.");
    return;
  }

  console.log("\nThe following features will be removed:");
  removals.forEach((feature) => {
    console.log(`  - ${feature}`);
  });
  console.log("");
}

async function executeRemovals(options: ConfigOptions): Promise<void> {
  if (options.removeStripe) {
    await removeStripe();
  }
  if (options.removeRedis) {
    await removeRedis();
  }
  if (options.removeAWS) {
    await removeAWS();
  }
}

async function interactiveMode(): Promise<void> {
  console.log("\n🔧 Catalyst Boilerplate Configuration\n");

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

  if (!response || !response.features || response.features.length === 0) {
    console.log("\nNo features selected. Keeping all features.");
    return;
  }

  const options: ConfigOptions = {};
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
    .option("--no-aws", "Remove AWS SES integration")
    .option(
      "--remove <features...>",
      "Remove specific features (comma-separated: stripe, redis, aws)"
    )
    .parse(process.argv);

  const opts = program.opts<{
    stripe?: boolean;
    redis?: boolean;
    aws?: boolean;
    remove?: string[];
  }>();

  const options: ConfigOptions = {};

  if (opts.stripe === false) {
    options.removeStripe = true;
  }
  if (opts.redis === false) {
    options.removeRedis = true;
  }
  if (opts.aws === false) {
    options.removeAWS = true;
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
        } else if (normalized === "aws") {
          options.removeAWS = true;
        } else {
          console.error(`Unknown feature: ${feature}`);
          console.error("Available features: stripe, redis, aws");
          process.exit(1);
        }
      });
    });
  }

  return options;
}

async function main(): Promise<void> {
  const options = parseArgs();

  if (Object.keys(options).length === 0) {
    await interactiveMode();
  } else {
    await showSummary(options);
    await executeRemovals(options);
  }
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});

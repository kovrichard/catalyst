import { readdirSync } from "node:fs";

// The bun runner passes testFiles to `bun test` verbatim and never expands globs, so a
// pattern here silently matches nothing and the run dies on an inspector timeout.
const testFiles = readdirSync("tests", { recursive: true })
  .map(String)
  .filter((file) => file.endsWith(".test.ts"))
  .map((file) => `tests/${file}`)
  .sort();

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  plugins: ["@hughescr/stryker-bun-runner"],
  testRunner: "bun",
  coverageAnalysis: "perTest",
  // The ring is the code the suite can exercise without a database, a browser, or a
  // network call. Everything excluded below is one of those boundaries: it reads the
  // session, opens a Prisma connection, talks to Redis/Stripe, or parses the
  // environment at module load, so every mutant there would report as uncovered and
  // drag the score down for no signal.
  mutate: [
    "src/lib/**/*.ts",
    "!src/lib/prisma/**",
    "!src/lib/dao/**",
    "!src/lib/actions/**",
    "!src/lib/trpc/init.ts",
    "!src/lib/trpc/routers/**",
    "!src/lib/auth-client.ts",
    "!src/lib/config.ts",
    "!src/lib/public-config.ts",
    "!src/lib/logger.ts",
    "!src/lib/metadata.ts",
    "!src/lib/session.ts",
    "!src/lib/stripe.ts",
    "!src/lib/stripe-public.ts",
    "scripts/utils/**/*.ts",
    "!scripts/utils/uninstaller.ts",
  ],
  concurrency: Number(process.env.STRYKER_CONCURRENCY ?? 4),
  bun: {
    testFiles,
    // No --isolate: bun re-runs the preload and rebuilds the module graph for every
    // file, and this runner's dry-run preload eager-imports every mutated module each
    // time.
    bunArgs: [],
    timeout: 60000,
    // Loading the whole suite pushes the runner's inspector handshake past its 5s
    // default.
    inspectorTimeout: 30000,
  },
  reporters: ["clear-text", "progress", "html"],
  thresholds: { high: 80, low: 60, break: 60 },
  // Stryker copies the project into a sandbox with fs.copyFile, which fails on the
  // symlinks under the agent directories (ENOTSUP). Excluding the tooling dirs also
  // keeps the sandbox down to what the suite needs.
  ignorePatterns: [
    ".agents",
    ".claude",
    ".codex",
    ".cursor",
    ".devcontainer",
    ".github",
    ".husky",
    ".opencode",
    ".playwright-cli",
    ".playwright-mcp",
    ".next",
    "certificates",
    "public",
  ],
  tempDirName: ".stryker-tmp",
  // Always clean: a crashed run otherwise leaves sandbox copies of biome.json behind,
  // which biome then rejects as nested root configurations.
  cleanTempDir: "always",
  htmlReporter: { fileName: "reports/mutation.html" },
};

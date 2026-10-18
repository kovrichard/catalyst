import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const LOCKFILE = "bun.lock";

function regenerateLockfile(): string | undefined {
  const r = spawnSync("bun", ["install", "--lockfile-only", "--ignore-scripts"], {
    encoding: "utf8",
  });
  return r.status === 0 ? undefined : r.stderr || "bun install --lockfile-only failed\n";
}

function regenerateThenRestore(original: string): {
  regenerated: string;
  error?: string;
} {
  try {
    return { error: regenerateLockfile(), regenerated: readFileSync(LOCKFILE, "utf8") };
  } finally {
    writeFileSync(LOCKFILE, original);
  }
}

function linesOnlyIn(text: string, other: string): string[] {
  const otherLines = new Set(other.split("\n"));
  return text.split("\n").filter((line) => !otherLines.has(line));
}

const current = readFileSync(LOCKFILE, "utf8");
const { regenerated, error } = regenerateThenRestore(current);

if (error) {
  process.stderr.write(error);
  process.exit(1);
}

if (regenerated !== current) {
  const stale = linesOnlyIn(current, regenerated).map((line) => `- ${line.trim()}`);
  const fresh = linesOnlyIn(regenerated, current).map((line) => `+ ${line.trim()}`);
  process.stderr.write(
    `${LOCKFILE} is out of sync with the package.json files. Run \`bun install\` and commit ${LOCKFILE}.\n${[...stale, ...fresh].join("\n")}\n`
  );
  process.exit(1);
}

process.stdout.write(`${LOCKFILE} matches the package.json files.\n`);

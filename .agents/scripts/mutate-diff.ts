import { spawnSync } from "node:child_process";
import { Glob } from "bun";
import strykerConfig from "../../stryker.config.mjs";

const baseRef = process.argv[2] ?? "origin/main";

function mutatePatterns(): string[] {
  const patterns = strykerConfig.mutate ?? [];
  return patterns.filter((pattern): pattern is string => typeof pattern === "string");
}

type MutateFilter = { includes: Glob[]; excludes: Glob[] };

function mutateFilter(patterns: string[]): MutateFilter {
  const includes: Glob[] = [];
  const excludes: Glob[] = [];
  for (const pattern of patterns) {
    if (pattern.startsWith("!")) {
      excludes.push(new Glob(pattern.slice(1)));
    } else {
      includes.push(new Glob(pattern));
    }
  }
  return { includes, excludes };
}

function isMutatable(path: string, filter: MutateFilter): boolean {
  if (filter.excludes.some((glob) => glob.match(path))) {
    return false;
  }
  return filter.includes.some((glob) => glob.match(path));
}

function diffAgainstBase(): string {
  const r = spawnSync(
    "git",
    ["diff", "--unified=0", "--diff-filter=ACMR", `${baseRef}...HEAD`],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  );
  if (r.status !== 0) {
    process.stderr.write(r.stderr || `git diff against ${baseRef} failed\n`);
    process.exit(1);
  }
  return r.stdout;
}

function changedRanges(diff: string, filter: MutateFilter): string[] {
  const ranges: string[] = [];
  let current: string | null = null;

  for (const line of diff.split("\n")) {
    const fileMatch = /^\+\+\+ b\/(.+)$/.exec(line);
    if (fileMatch) {
      const path = fileMatch[1];
      current = isMutatable(path, filter) ? path : null;
      continue;
    }

    if (!current) continue;

    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (!hunk) continue;

    const start = Number(hunk[1]);
    const count = hunk[2] === undefined ? 1 : Number(hunk[2]);
    if (count === 0) continue;

    ranges.push(`${current}:${start}-${start + count - 1}`);
  }

  return ranges;
}

function runStryker(ranges: string[]): number {
  const r = spawnSync("bunx", ["stryker", "run", "--mutate", ranges.join(",")], {
    stdio: "inherit",
  });
  return r.status ?? 1;
}

const patterns = mutatePatterns();
const ranges = changedRanges(diffAgainstBase(), mutateFilter(patterns));

process.stderr.write(
  `Mutation gate covers ${patterns.length} glob(s): ${patterns.join(", ")}\n` +
    `Changes outside these paths are NOT mutation-tested.\n`
);

if (ranges.length === 0) {
  process.stderr.write(`No mutatable changes against ${baseRef} — nothing to gate.\n`);
  process.exit(0);
}

process.stderr.write(
  `Mutating ${ranges.length} changed range(s):\n${ranges.join("\n")}\n`
);
process.exit(runStryker(ranges));

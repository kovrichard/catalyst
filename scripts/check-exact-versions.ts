import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DEPENDENCY_SECTIONS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
  "overrides",
] as const;

const EXACT_SEMVER = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/;

type Manifest = Partial<Record<string, unknown>>;

type NonExactVersion = {
  section: (typeof DEPENDENCY_SECTIONS)[number];
  name: string;
  version: string;
};

export function nonExactVersions(manifest: Manifest): NonExactVersion[] {
  return DEPENDENCY_SECTIONS.flatMap((section) =>
    Object.entries((manifest[section] ?? {}) as Record<string, string>)
      .filter(([, version]) => !EXACT_SEMVER.test(version))
      .map(([name, version]) => ({ section, name, version }))
  );
}

function trackedManifests(): string[] {
  const listed = spawnSync("git", ["ls-files", "package.json", "**/package.json"], {
    encoding: "utf8",
  });
  if (listed.status !== 0) {
    process.stderr.write(listed.stderr || "git ls-files failed\n");
    process.exit(1);
  }
  return listed.stdout.split("\n").filter(Boolean);
}

function readManifest(path: string): Manifest {
  try {
    return JSON.parse(readFileSync(resolve(path), "utf8"));
  } catch (error) {
    process.stderr.write(`${path} is not valid JSON: ${(error as Error).message}\n`);
    process.exit(1);
  }
}

if (import.meta.main) {
  const offenders = trackedManifests().flatMap((path) =>
    nonExactVersions(readManifest(path)).map(
      (o) => `  ${path} ${o.section}: ${o.name} ${o.version}`
    )
  );
  if (offenders.length === 0) {
    process.stdout.write("Every dependency in every package.json is pinned exactly.\n");
    process.exit(0);
  }
  process.stderr.write(
    `Dependencies without an exact version:\n${offenders.join("\n")}\n` +
      "Pin each to the version bun.lock resolves (bun add --exact <name>@<version>).\n"
  );
  process.exit(1);
}

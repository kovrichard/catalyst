import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";

const REMOVER_GLOB = "scripts/removers/*.ts";
const MARKER = /@catalyst:([a-z]+)-start/g;

const SEARCH_GLOBS = ["src/**/*.{ts,tsx}", "Dockerfile", "docker-compose.yml"];

const GENERATED = /^src\/lib\/prisma\/generated\//;

interface Remover {
  file: string;
  featureName: string;
  markerName: string;
  filesToModify: string[];
  removedPaths: string[];
  scriptsToRemove: string[];
}

function listBracket(source: string, suffix: string): string[] {
  const match = new RegExp(String.raw`const \w+_${suffix} = \[([^\]]*)\]`).exec(source);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

async function scan(patterns: string[]): Promise<string[]> {
  const found: string[] = [];
  for (const pattern of patterns) {
    for await (const file of new Bun.Glob(pattern).scan(".")) found.push(file);
  }
  return found;
}

const removers: Remover[] = (await scan([REMOVER_GLOB]))
  .filter((file) => !file.endsWith("remover.ts"))
  .map((file) => {
    const source = readFileSync(file, "utf-8");
    const featureName = /featureName: "([^"]+)"/.exec(source)?.[1] ?? "";
    const markerName = /markerName: "([^"]+)"/.exec(source)?.[1];
    return {
      file,
      featureName,
      markerName: markerName ?? featureName.toLowerCase(),
      filesToModify: listBracket(source, "FILES_TO_MODIFY"),
      removedPaths: [
        ...listBracket(source, "FILES_TO_DELETE"),
        ...listBracket(source, "FOLDERS_TO_DELETE"),
        ...listBracket(source, "DIRECTORIES_TO_DELETE"),
      ],
      scriptsToRemove: listBracket(source, "SCRIPTS_TO_REMOVE"),
    };
  });

const sources = await scan(SEARCH_GLOBS);

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function markersIn(file: string): string[] {
  const text = readFileSync(file, "utf-8");
  return [...text.matchAll(MARKER)].map((match) => match[1]);
}

const markerUses = sources
  .filter((file) => !GENERATED.test(file))
  .flatMap((file) => markersIn(file).map((feature) => ({ file, feature })));

describe("remover coverage", () => {
  it("finds the removers and the markers they are meant to strip", () => {
    expect(removers.length).toBeGreaterThan(3);
    expect(markerUses.length).toBeGreaterThan(3);
  });

  it("has a remover claiming every marker in the tree", () => {
    const claimed = new Set(removers.map((remover) => remover.markerName));
    const orphans = [...new Set(markerUses.map((use) => use.feature))].filter(
      (feature) => !claimed.has(feature)
    );
    expect(orphans).toEqual([]);
  });

  it("either strips or deletes every marked file", () => {
    const missed = markerUses.filter(({ file, feature }) => {
      const owner = removers.find((remover) => remover.markerName === feature);
      if (!owner) return false;
      const stripped = owner.filesToModify.includes(file);
      const deleted = owner.removedPaths.some(
        (path) => file === path || file.startsWith(`${path}/`)
      );
      return !stripped && !deleted;
    });
    expect(unique(missed.map((use) => `${use.feature}:${use.file}`))).toEqual([]);
  });

  it("only removes scripts that package.json actually defines", () => {
    const { scripts } = JSON.parse(readFileSync("package.json", "utf-8")) as {
      scripts: Record<string, string>;
    };
    const unknown = removers.flatMap((remover) =>
      remover.scriptsToRemove
        .filter((name) => !(name in scripts))
        .map((name) => `${remover.featureName}:${name}`)
    );
    expect(unknown).toEqual([]);
  });
});

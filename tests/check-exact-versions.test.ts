import { describe, expect, test } from "bun:test";
import { nonExactVersions } from "../scripts/check-exact-versions";

describe("nonExactVersions", () => {
  test("flags caret, tilde, latest, ranges and wildcards in every dependency section", () => {
    const manifest = {
      dependencies: { a: "^1.2.3", b: "1.2.3" },
      devDependencies: { c: "~2.0.0", d: "latest" },
      optionalDependencies: { e: ">=1.0.0", f: "*" },
      peerDependencies: { g: "1.x" },
    };
    expect(nonExactVersions(manifest)).toEqual([
      { section: "dependencies", name: "a", version: "^1.2.3" },
      { section: "devDependencies", name: "c", version: "~2.0.0" },
      { section: "devDependencies", name: "d", version: "latest" },
      { section: "optionalDependencies", name: "e", version: ">=1.0.0" },
      { section: "optionalDependencies", name: "f", version: "*" },
      { section: "peerDependencies", name: "g", version: "1.x" },
    ]);
  });

  test("accepts exact versions, prereleases included", () => {
    const manifest = {
      dependencies: { a: "1.2.3", b: "0.0.1-canary.10", c: "2.0.0-beta.1+build.5" },
    };
    expect(nonExactVersions(manifest)).toEqual([]);
  });

  test("ignores engines and a manifest without dependency sections", () => {
    expect(nonExactVersions({ engines: { bun: ">=1.3.0" } })).toEqual([]);
  });

  test("flags a non-exact override", () => {
    expect(nonExactVersions({ overrides: { "playwright-core": "*" } })).toEqual([
      { section: "overrides", name: "playwright-core", version: "*" },
    ]);
  });
});

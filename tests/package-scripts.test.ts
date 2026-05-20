import { describe, expect, it } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { removePackageJsonScripts } from "../scripts/utils/package-scripts";

function withFakeProject(
  packageJson: Record<string, unknown> | string | null,
  run: () => void
): void {
  const dir = mkdtempSync(join(tmpdir(), "catalyst-pkg-scripts-"));
  if (packageJson !== null) {
    const content =
      typeof packageJson === "string"
        ? packageJson
        : JSON.stringify(packageJson, null, 2);
    writeFileSync(join(dir, "package.json"), content, "utf-8");
  }
  const previousCwd = process.cwd();
  process.chdir(dir);
  try {
    run();
  } finally {
    process.chdir(previousCwd);
    rmSync(dir, { recursive: true });
  }
}

describe("removePackageJsonScripts", () => {
  it("removes the named script and leaves siblings intact", () => {
    withFakeProject(
      {
        name: "subject",
        scripts: { build: "tsc", "dev-email": "email dev --port 3001", test: "bun test" },
      },
      () => {
        const results = removePackageJsonScripts(["dev-email"]);
        expect(results).toHaveLength(1);
        expect(results[0].success).toBe(true);
        expect(results[0].message).toContain("Removed");

        const after = JSON.parse(readFileSync("package.json", "utf-8")) as {
          scripts: Record<string, string>;
        };
        expect(after.scripts).toEqual({ build: "tsc", test: "bun test" });
      }
    );
  });

  it("removes multiple scripts in one call", () => {
    withFakeProject(
      {
        scripts: {
          postinstall: "prisma generate",
          "db:migrate": "prisma migrate dev",
          "db:deploy": "prisma migrate deploy",
          dev: "next dev",
        },
      },
      () => {
        removePackageJsonScripts(["postinstall", "db:migrate", "db:deploy"]);
        const after = JSON.parse(readFileSync("package.json", "utf-8")) as {
          scripts: Record<string, string>;
        };
        expect(after.scripts).toEqual({ dev: "next dev" });
      }
    );
  });

  it("reports missing scripts as skipped, not failed", () => {
    withFakeProject({ scripts: { build: "tsc" } }, () => {
      const results = removePackageJsonScripts(["does-not-exist"]);
      expect(results[0].success).toBe(true);
      expect(results[0].message).toContain("not present");

      // File is untouched.
      const after = readFileSync("package.json", "utf-8");
      expect(after).toContain('"build": "tsc"');
    });
  });

  it("respects dryRun — no write, reports 'Would remove'", () => {
    withFakeProject({ scripts: { "dev-email": "email dev" } }, () => {
      const before = readFileSync("package.json", "utf-8");
      const results = removePackageJsonScripts(["dev-email"], true);
      expect(results[0].success).toBe(true);
      expect(results[0].message).toContain("Would remove");

      const after = readFileSync("package.json", "utf-8");
      expect(after).toBe(before);
    });
  });

  it("preserves the original indentation style", () => {
    const tabIndented = `{\n\t"scripts": {\n\t\t"keep": "echo keep",\n\t\t"drop": "echo drop"\n\t}\n}\n`;
    withFakeProject(tabIndented, () => {
      removePackageJsonScripts(["drop"]);
      const after = readFileSync("package.json", "utf-8");
      expect(after).toContain('\t"scripts"');
      expect(after).toContain('\t\t"keep"');
      expect(after).not.toContain('"drop"');
    });
  });

  it("returns a failure when package.json is missing", () => {
    withFakeProject(null, () => {
      const results = removePackageJsonScripts(["build"]);
      expect(results[0].success).toBe(false);
      expect(results[0].message).toContain("not found");
    });
  });

  it("returns failures when package.json is malformed", () => {
    withFakeProject("{ not valid json", () => {
      const results = removePackageJsonScripts(["build"]);
      expect(results[0].success).toBe(false);
      expect(results[0].message).toContain("parse");
    });
  });

  it("returns an empty array when given no script names", () => {
    withFakeProject({ scripts: { build: "tsc" } }, () => {
      const results = removePackageJsonScripts([]);
      expect(results).toEqual([]);
    });
  });
});

import { describe, expect, it } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createMarkerOptions,
  removeMarkedCode,
} from "../scripts/utils/code-modifications";

function withTempFile(content: string, run: (relPath: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), "catalyst-mods-"));
  const fullPath = join(dir, "subject.ts");
  writeFileSync(fullPath, content, "utf-8");
  const previousCwd = process.cwd();
  process.chdir(dir);
  try {
    run("subject.ts");
  } finally {
    process.chdir(previousCwd);
    rmSync(dir, { recursive: true });
  }
}

describe("removeMarkedCode — line hygiene", () => {
  it("collapses orphan blank lines left by import-group markers", () => {
    const input = [
      `import { a } from "x";`,
      ``,
      `// @catalyst:auth-start`,
      ``,
      `import { b } from "y";`,
      `// @catalyst:auth-end`,
      ``,
      `export const value = a;`,
      ``,
    ].join("\n");

    withTempFile(input, (rel) => {
      const result = removeMarkedCode(rel, createMarkerOptions("auth"));
      expect(result.success).toBe(true);
      const actual = readFileSync(rel, "utf-8");
      expect(actual).toBe(
        [`import { a } from "x";`, ``, `export const value = a;`, ``].join("\n")
      );
    });
  });

  it("preserves a single blank line between sections", () => {
    const input = [
      `const before = 1;`,
      ``,
      `// @catalyst:auth-start`,
      `const removed = 2;`,
      `// @catalyst:auth-end`,
      ``,
      `const after = 3;`,
    ].join("\n");

    withTempFile(input, (rel) => {
      removeMarkedCode(rel, createMarkerOptions("auth"));
      const actual = readFileSync(rel, "utf-8");
      expect(actual).toBe([`const before = 1;`, ``, `const after = 3;`].join("\n"));
    });
  });

  it("strips blank lines left at block boundaries after marker removal", () => {
    const input = [
      `const schema = z.object({`,
      `  general: 1,`,
      ``,
      `  // @catalyst:auth-start`,
      `  authField: 2,`,
      `  // @catalyst:auth-end`,
      `});`,
    ].join("\n");

    withTempFile(input, (rel) => {
      removeMarkedCode(rel, createMarkerOptions("auth"));
      const actual = readFileSync(rel, "utf-8");
      expect(actual).toBe(
        [`const schema = z.object({`, `  general: 1,`, `});`].join("\n")
      );
    });
  });

  it("strips blank lines immediately after a block opener", () => {
    const input = [
      `function Layout({ children }) {`,
      `  // @catalyst:auth-start`,
      `  const user = useUser();`,
      `  // @catalyst:auth-end`,
      ``,
      `  return <main>{children}</main>;`,
      `}`,
    ].join("\n");

    withTempFile(input, (rel) => {
      removeMarkedCode(rel, createMarkerOptions("auth"));
      const actual = readFileSync(rel, "utf-8");
      expect(actual).toBe(
        [
          `function Layout({ children }) {`,
          `  return <main>{children}</main>;`,
          `}`,
        ].join("\n")
      );
    });
  });

  it("leaves files without markers untouched", () => {
    const input = `const x = 1;\n\n\nconst y = 2;\n`;
    withTempFile(input, (rel) => {
      removeMarkedCode(rel, createMarkerOptions("auth"));
      const actual = readFileSync(rel, "utf-8");
      expect(actual).toBe(input);
    });
  });
});

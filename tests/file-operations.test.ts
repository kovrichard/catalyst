import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  deleteDirectories,
  deleteDirectory,
  deleteFile,
  deleteFiles,
} from "../scripts/utils/file-operations";

let projectDir = "";
let previousCwd = "";

function givenFile(relativePath: string): void {
  writeFileSync(join(projectDir, relativePath), "content", "utf-8");
}

function givenDirectory(relativePath: string): void {
  mkdirSync(join(projectDir, relativePath), { recursive: true });
}

beforeEach(() => {
  previousCwd = process.cwd();
  projectDir = mkdtempSync(join(tmpdir(), "catalyst-file-ops-"));
  process.chdir(projectDir);
});

afterEach(() => {
  process.chdir(previousCwd);
  rmSync(projectDir, { recursive: true, force: true });
});

describe("deleteFile", () => {
  it("removes an existing file", () => {
    givenFile("doomed.ts");

    const result = deleteFile("doomed.ts");

    expect(result.success).toBe(true);
    expect(existsSync(join(projectDir, "doomed.ts"))).toBe(false);
  });

  it("reports what it deleted", () => {
    givenFile("doomed.ts");

    expect(deleteFile("doomed.ts").message).toBe("Deleted: doomed.ts");
  });

  it("fails on a missing file", () => {
    const result = deleteFile("ghost.ts");

    expect(result.success).toBe(false);
    expect(result.message).toBe("File does not exist: ghost.ts");
  });

  it("leaves the file in place on a dry run", () => {
    givenFile("doomed.ts");

    const result = deleteFile("doomed.ts", true);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Would delete: doomed.ts");
    expect(existsSync(join(projectDir, "doomed.ts"))).toBe(true);
  });

  it("fails a dry run on a missing file", () => {
    expect(deleteFile("ghost.ts", true).success).toBe(false);
  });

  it("resolves paths against the working directory", () => {
    givenDirectory("src/lib");
    givenFile("src/lib/nested.ts");

    expect(deleteFile("src/lib/nested.ts").success).toBe(true);
    expect(existsSync(join(projectDir, "src/lib/nested.ts"))).toBe(false);
  });

  it("fails when the path is a directory", () => {
    givenDirectory("a-folder");

    expect(deleteFile("a-folder").success).toBe(false);
  });
});

describe("deleteDirectory", () => {
  it("removes a directory and its contents", () => {
    givenDirectory("feature/inner");
    givenFile("feature/inner/file.ts");

    const result = deleteDirectory("feature");

    expect(result.success).toBe(true);
    expect(existsSync(join(projectDir, "feature"))).toBe(false);
  });

  it("reports what it deleted", () => {
    givenDirectory("feature");

    expect(deleteDirectory("feature").message).toBe("Deleted directory: feature");
  });

  it("fails on a missing directory", () => {
    const result = deleteDirectory("ghost");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Directory does not exist: ghost");
  });

  it("leaves the directory in place on a dry run", () => {
    givenDirectory("feature");

    const result = deleteDirectory("feature", true);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Would delete directory: feature");
    expect(existsSync(join(projectDir, "feature"))).toBe(true);
  });
});

describe("deleteFiles", () => {
  it("returns one result per path, in order", () => {
    givenFile("first.ts");
    givenFile("third.ts");

    const results = deleteFiles(["first.ts", "second.ts", "third.ts"]);

    expect(results.map((result) => result.success)).toEqual([true, false, true]);
  });

  it("returns nothing for an empty list", () => {
    expect(deleteFiles([])).toEqual([]);
  });

  it("forwards the dry-run flag to every path", () => {
    givenFile("kept.ts");

    const results = deleteFiles(["kept.ts"], true);

    expect(results[0].message).toBe("Would delete: kept.ts");
    expect(existsSync(join(projectDir, "kept.ts"))).toBe(true);
  });
});

describe("deleteDirectories", () => {
  it("returns one result per path, in order", () => {
    givenDirectory("first");
    givenDirectory("third");

    const results = deleteDirectories(["first", "second", "third"]);

    expect(results.map((result) => result.success)).toEqual([true, false, true]);
  });

  it("returns nothing for an empty list", () => {
    expect(deleteDirectories([])).toEqual([]);
  });

  it("forwards the dry-run flag to every path", () => {
    givenDirectory("kept");

    const results = deleteDirectories(["kept"], true);

    expect(results[0].message).toBe("Would delete directory: kept");
    expect(existsSync(join(projectDir, "kept"))).toBe(true);
  });
});

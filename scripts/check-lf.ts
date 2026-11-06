import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const WHITESPACE = /\s+/;
const CRLF_OR_MIXED = /crlf|mixed/;

function listTrackedFilesWithEol(): string[] {
  const r = spawnSync("git", ["ls-files", "--eol"], { encoding: "utf8" });
  if (r.status !== 0) {
    process.stderr.write(r.stderr || "git ls-files --eol failed\n");
    process.exit(1);
  }
  return r.stdout.split("\n").filter(Boolean);
}

export function hasCarriageReturn(eolLine: string): boolean {
  const [index, worktree] = eolLine.split(WHITESPACE);
  return CRLF_OR_MIXED.test(index) || CRLF_OR_MIXED.test(worktree);
}

function pathFrom(eolLine: string): string {
  return eolLine.split("\t").slice(1).join("\t");
}

// A NUL byte is git's own heuristic for binary content. Rewriting CR bytes inside
// an image or archive would corrupt it, so those are reported and left alone.
export function isBinary(contents: Buffer): boolean {
  return contents.includes(0);
}

function convertToLf(path: string): boolean {
  const contents = readFileSync(path);
  if (isBinary(contents)) {
    return false;
  }
  writeFileSync(path, contents.toString("utf8").replaceAll("\r\n", "\n"), "utf8");
  return true;
}

function reportAndExit(offenders: string[]): never {
  process.stderr.write(
    `CRLF found in tracked files (LF required):\n${offenders.join("\n")}\n` +
      "Run 'bun run lf:fix' to convert them.\n"
  );
  process.exit(1);
}

function fixAndExit(offenders: string[]): never {
  const skipped = offenders.filter((path) => !convertToLf(path));
  const converted = offenders.length - skipped.length;
  process.stdout.write(`Converted ${converted} file(s) to LF.\n`);
  if (skipped.length === 0) {
    process.exit(0);
  }
  process.stderr.write(`Skipped binary file(s):\n${skipped.join("\n")}\n`);
  process.exit(1);
}

if (import.meta.main) {
  const offenders = listTrackedFilesWithEol().filter(hasCarriageReturn).map(pathFrom);

  if (offenders.length === 0) {
    process.stdout.write("All tracked files use LF line endings.\n");
    process.exit(0);
  }

  if (process.argv.includes("--fix")) {
    fixAndExit(offenders);
  }
  reportAndExit(offenders);
}

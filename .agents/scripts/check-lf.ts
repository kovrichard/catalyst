import { spawnSync } from "node:child_process";

function listTrackedFilesWithEol(): string[] {
  const r = spawnSync("git", ["ls-files", "--eol"], { encoding: "utf8" });
  if (r.status !== 0) {
    process.stderr.write(r.stderr || "git ls-files --eol failed\n");
    process.exit(1);
  }
  return r.stdout.split("\n").filter(Boolean);
}

function hasCarriageReturn(eolLine: string): boolean {
  const [index, worktree] = eolLine.split(/\s+/);
  return /crlf|mixed/.test(index) || /crlf|mixed/.test(worktree);
}

function pathFrom(eolLine: string): string {
  return eolLine.split("\t").slice(1).join("\t");
}

const offenders = listTrackedFilesWithEol().filter(hasCarriageReturn).map(pathFrom);

if (offenders.length > 0) {
  process.stderr.write(
    `CRLF found in tracked files (LF required):\n${offenders.join("\n")}\n`
  );
  process.exit(1);
}

process.stdout.write("All tracked files use LF line endings.\n");

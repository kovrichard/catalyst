import { spawnSync } from "node:child_process";

type HookFormat = "claude" | "cursor" | "opencode" | "codex";

export function hookFormatFromArgs(args: string[] = process.argv.slice(2)): HookFormat {
  if (args.includes("--codex")) return "codex";
  if (args.includes("--cursor")) return "cursor";
  if (args.includes("--opencode")) return "opencode";
  return "claude";
}

function writeFailure(format: HookFormat, output: string): void {
  if (format === "codex") {
    process.stderr.write(output);
    return;
  }
  process.stderr.write(output);
}

export function runHook(args: string[], format = hookFormatFromArgs()): number {
  if (args.length === 0) {
    writeFailure(format, "run-hook: no command provided");
    return 2;
  }
  const command = args.join(" ");
  const r = spawnSync(command, {
    encoding: "utf8",
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const out = [r.stdout, r.stderr].filter(Boolean).join("\n").trim();
  const output = out || "(no output)";
  const ok = (r.status ?? -1) === 0;

  if (ok) {
    if (format === "codex") return 0;
    process.stdout.write(JSON.stringify({ output }));
    return 0;
  }
  writeFailure(format, output);
  return 2;
}

if (import.meta.main) {
  const exitCode = runHook(process.argv.slice(2));
  process.exit(exitCode);
}

import { spawnSync } from "node:child_process";

export function runHook(args: string[]): number {
  if (args.length === 0) {
    const msg = "run-hook: no command provided";
    process.stderr.write(msg);
    process.exit(2);
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
    process.stdout.write(JSON.stringify({ output }));
    return 0;
  }
  process.stderr.write(output);
  return 2;
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const exitCode = runHook(args);
  process.exit(exitCode);
}

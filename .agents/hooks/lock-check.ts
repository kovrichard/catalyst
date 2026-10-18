import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "lock:check"]);
process.exit(exitCode);

import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "check-write"]);
process.exit(exitCode);

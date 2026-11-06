import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "exact-versions"]);
process.exit(exitCode);

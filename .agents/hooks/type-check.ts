import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "type-check"]);
process.exit(exitCode);

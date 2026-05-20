import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "check"]);
process.exit(exitCode);

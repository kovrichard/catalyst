import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "test"]);
process.exit(exitCode);

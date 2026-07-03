import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "lf"]);
process.exit(exitCode);

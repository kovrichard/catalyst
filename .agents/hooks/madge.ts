import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "madge"]);
process.exit(exitCode);

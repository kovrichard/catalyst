import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "knip"]);
process.exit(exitCode);

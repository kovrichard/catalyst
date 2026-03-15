import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "build"]);
process.exit(exitCode);

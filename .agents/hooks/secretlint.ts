import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "secretlint"]);
process.exit(exitCode);

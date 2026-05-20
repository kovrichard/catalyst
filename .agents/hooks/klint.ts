import { runHook } from "./run-hook";

const exitCode = runHook(["bun", "run", "klint", "--json"]);
process.exit(exitCode);

import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

// Next writes BUILD_ID at build time and its production server refuses to boot
// without it (error E427), so a real deployment always has one. Without a build
// the value is a constant, which keeps the reload prompt quiet during dev.
const BUILD_ID_PATH = join(process.cwd(), ".next", "BUILD_ID");
const UNBUILT_VERSION = "development";

let cachedVersion: string | null = null;

function readBuildId(): string {
  try {
    return readFileSync(BUILD_ID_PATH, "utf8").trim() || UNBUILT_VERSION;
  } catch {
    return UNBUILT_VERSION;
  }
}

export function getAppVersion(): string {
  cachedVersion ??= readBuildId();
  return cachedVersion;
}

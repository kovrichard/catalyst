import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { OperationResult } from "../types/operation-result";

const PACKAGE_JSON_PATH = "package.json";

export function removePackageJsonScripts(
  scriptNames: string[],
  dryRun = false
): OperationResult[] {
  if (scriptNames.length === 0) return [];

  const fullPath = join(process.cwd(), PACKAGE_JSON_PATH);
  if (!existsSync(fullPath)) {
    return scriptNames.map((name) => ({
      success: false,
      message: `package.json not found while removing script "${name}"`,
    }));
  }

  const raw = readFileSync(fullPath, "utf-8");
  // package.json may use tabs or spaces; preserve whichever it was authored with.
  const indentMatch = /^(\s+)"/m.exec(raw);
  const indent = indentMatch?.[1] ?? "  ";
  let parsed: { scripts?: Record<string, string> };
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return scriptNames.map((name) => ({
      success: false,
      message: `Failed to parse package.json while removing script "${name}": ${message}`,
    }));
  }

  const results: OperationResult[] = [];
  let changed = false;
  for (const name of scriptNames) {
    if (parsed.scripts && Object.hasOwn(parsed.scripts, name)) {
      if (!dryRun) {
        delete parsed.scripts[name];
      }
      changed = true;
      results.push({
        success: true,
        message: dryRun
          ? `Would remove script "${name}" from package.json`
          : `Removed script "${name}" from package.json`,
      });
    } else {
      results.push({
        success: true,
        message: `Script "${name}" not present in package.json — skipped`,
      });
    }
  }

  if (changed && !dryRun) {
    writeFileSync(fullPath, `${JSON.stringify(parsed, null, indent)}\n`, "utf-8");
  }

  return results;
}

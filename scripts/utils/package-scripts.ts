import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { OperationResult } from "../types/operation-result";

const PACKAGE_JSON_PATH = "package.json";

type ScriptOutcome = {
  removed: boolean;
  result: OperationResult;
};

function failEveryScript(
  scriptNames: string[],
  message: (name: string) => string
): OperationResult[] {
  return scriptNames.map((name) => ({ success: false, message: message(name) }));
}

function removeScript(
  scripts: Record<string, string> | undefined,
  name: string,
  dryRun: boolean
): ScriptOutcome {
  if (!scripts || !Object.hasOwn(scripts, name)) {
    return {
      removed: false,
      result: {
        success: true,
        message: `Script "${name}" not present in package.json — skipped`,
      },
    };
  }

  if (!dryRun) {
    delete scripts[name];
  }

  return {
    removed: true,
    result: {
      success: true,
      message: dryRun
        ? `Would remove script "${name}" from package.json`
        : `Removed script "${name}" from package.json`,
    },
  };
}

export function removePackageJsonScripts(
  scriptNames: string[],
  dryRun = false
): OperationResult[] {
  if (scriptNames.length === 0) {
    return [];
  }

  const fullPath = join(process.cwd(), PACKAGE_JSON_PATH);
  if (!existsSync(fullPath)) {
    return failEveryScript(
      scriptNames,
      (name) => `package.json not found while removing script "${name}"`
    );
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
    return failEveryScript(
      scriptNames,
      (name) => `Failed to parse package.json while removing script "${name}": ${message}`
    );
  }

  const outcomes = scriptNames.map((name) => removeScript(parsed.scripts, name, dryRun));

  if (!dryRun && outcomes.some((outcome) => outcome.removed)) {
    writeFileSync(fullPath, `${JSON.stringify(parsed, null, indent)}\n`, "utf-8");
  }

  return outcomes.map((outcome) => outcome.result);
}

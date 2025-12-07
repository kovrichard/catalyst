import { spawnSync } from "child_process";
import type { OperationResult } from "../types/operation-result";

export function uninstallPackage(packageName: string, dryRun = false): OperationResult {
  if (dryRun) {
    console.log(`Would uninstall ${packageName}`);
    return {
      success: true,
      message: `Would uninstall ${packageName}`,
    };
  }

  try {
    spawnSync("bun", ["remove", packageName]);
    return {
      success: true,
      message: `Uninstalled ${packageName}`,
    };
  } catch (error) {
    console.error(
      `Failed to uninstall ${packageName}: ${error instanceof Error ? error.message : String(error)}`
    );
    return {
      success: false,
      message: `Failed to uninstall ${packageName}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export function uninstallPackages(
  packageNames: string[],
  dryRun = false
): OperationResult[] {
  return packageNames.map((packageName) => uninstallPackage(packageName, dryRun));
}

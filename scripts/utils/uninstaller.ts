import { spawnSync } from "node:child_process";
import type { OperationResult } from "../types/operation-result";

export function uninstallPackage(packageName: string, dryRun = false): OperationResult {
  if (dryRun) {
    console.log(`Would uninstall ${packageName}`);
    return {
      success: true,
      message: `Would uninstall ${packageName}`,
    };
  }

  const result = spawnSync(
    "bun", // NOSONAR: executed only locally
    ["remove", packageName],
    {
      stdio: "inherit",
      encoding: "utf-8",
    }
  );

  if (result.error) {
    const errorMessage = result.error.message || String(result.error);
    console.error(`Failed to uninstall ${packageName}: ${errorMessage}`);
    return {
      success: false,
      message: `Failed to uninstall ${packageName}: ${errorMessage}`,
    };
  }

  if (result.status !== 0) {
    const errorMessage =
      result.stderr?.toString() || `Process exited with code ${result.status}`;
    console.error(`Failed to uninstall ${packageName}: ${errorMessage}`);
    return {
      success: false,
      message: `Failed to uninstall ${packageName}: ${errorMessage}`,
    };
  }

  return {
    success: true,
    message: `Uninstalled ${packageName}`,
  };
}

export function uninstallPackages(
  packageNames: string[],
  dryRun = false
): OperationResult[] {
  return packageNames.map((packageName) => uninstallPackage(packageName, dryRun));
}

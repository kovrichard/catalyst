import { existsSync, rmSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import type { OperationResult } from "../types/operation-result";

export function deleteFile(filePath: string, dryRun = false): OperationResult {
  const fullPath = join(process.cwd(), filePath);

  if (!existsSync(fullPath)) {
    // Cascading removers may have already deleted this file. Treat as a
    // no-op rather than a hard failure so cascade output stays clean.
    return {
      success: true,
      message: `Skipped (already removed): ${filePath}`,
    };
  }

  if (dryRun) {
    return {
      success: true,
      message: `Would delete: ${filePath}`,
    };
  }

  try {
    unlinkSync(fullPath);
    return {
      success: true,
      message: `Deleted: ${filePath}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export function deleteDirectory(dirPath: string, dryRun = false): OperationResult {
  const fullPath = join(process.cwd(), dirPath);

  if (!existsSync(fullPath)) {
    // Cascading removers may have already deleted this directory. Treat as a
    // no-op rather than a hard failure so cascade output stays clean.
    return {
      success: true,
      message: `Skipped (already removed): ${dirPath}`,
    };
  }

  if (dryRun) {
    return {
      success: true,
      message: `Would delete directory: ${dirPath}`,
    };
  }

  try {
    rmSync(fullPath, { recursive: true, force: true });
    return {
      success: true,
      message: `Deleted directory: ${dirPath}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export function deleteFiles(filePaths: string[], dryRun = false): OperationResult[] {
  return filePaths.map((filePath) => deleteFile(filePath, dryRun));
}

export function deleteDirectories(
  directoryPaths: string[],
  dryRun = false
): OperationResult[] {
  return directoryPaths.map((directoryPath) => deleteDirectory(directoryPath, dryRun));
}

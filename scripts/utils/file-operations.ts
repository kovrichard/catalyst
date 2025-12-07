import { existsSync, rmSync, unlinkSync } from "fs";
import { join } from "path";
import type { OperationResult } from "../types/operation-result";

export function deleteFile(filePath: string, dryRun = false): OperationResult {
  const fullPath = join(process.cwd(), filePath);

  if (!existsSync(fullPath)) {
    return {
      success: false,
      message: `File does not exist: ${filePath}`,
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
    return {
      success: false,
      message: `Directory does not exist: ${dirPath}`,
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

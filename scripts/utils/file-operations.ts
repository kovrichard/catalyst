import { existsSync, rmSync, unlinkSync } from "fs";
import { join } from "path";

export interface FileOperationResult {
  success: boolean;
  message: string;
  filePath: string;
}

export function deleteFile(filePath: string, dryRun = false): FileOperationResult {
  const fullPath = join(process.cwd(), filePath);

  if (!existsSync(fullPath)) {
    return {
      success: false,
      message: `File does not exist: ${filePath}`,
      filePath,
    };
  }

  if (dryRun) {
    return {
      success: true,
      message: `Would delete: ${filePath}`,
      filePath,
    };
  }

  try {
    unlinkSync(fullPath);
    return {
      success: true,
      message: `Deleted: ${filePath}`,
      filePath,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
      filePath,
    };
  }
}

export function deleteDirectory(dirPath: string, dryRun = false): FileOperationResult {
  const fullPath = join(process.cwd(), dirPath);

  if (!existsSync(fullPath)) {
    return {
      success: false,
      message: `Directory does not exist: ${dirPath}`,
      filePath: dirPath,
    };
  }

  if (dryRun) {
    return {
      success: true,
      message: `Would delete directory: ${dirPath}`,
      filePath: dirPath,
    };
  }

  try {
    rmSync(fullPath, { recursive: true, force: true });
    return {
      success: true,
      message: `Deleted directory: ${dirPath}`,
      filePath: dirPath,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`,
      filePath: dirPath,
    };
  }
}

export function deleteFiles(filePaths: string[], dryRun = false): FileOperationResult[] {
  return filePaths.map((filePath) => deleteFile(filePath, dryRun));
}

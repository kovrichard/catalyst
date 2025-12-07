import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { OperationResult } from "../types/operation-result";

export interface MarkerOptions {
  startMarker: string;
  endMarker: string;
}

function removeCodeBetweenMarkers(
  content: string,
  startMarker: string,
  endMarker: string
): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let insideMarker = false;
  let markerFound = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes(startMarker)) {
      insideMarker = true;
      markerFound = true;
      continue;
    }

    if (line.includes(endMarker)) {
      insideMarker = false;
      continue;
    }

    if (!insideMarker) {
      result.push(line);
    }
  }

  if (!markerFound) {
    return content;
  }

  return result.join("\n");
}

export function removeMarkedCode(
  filePath: string,
  options: MarkerOptions,
  dryRun = false
): OperationResult {
  const fullPath = join(process.cwd(), filePath);

  if (!existsSync(fullPath)) {
    return {
      success: false,
      message: `File does not exist: ${filePath}`,
    };
  }

  try {
    const content = readFileSync(fullPath, "utf-8");
    const modifiedContent = removeCodeBetweenMarkers(
      content,
      options.startMarker,
      options.endMarker
    );

    if (content === modifiedContent) {
      return {
        success: true,
        message: `No marked code found in ${filePath}`,
      };
    }

    if (dryRun) {
      return {
        success: true,
        message: `Would remove marked code from ${filePath}`,
      };
    }

    writeFileSync(fullPath, modifiedContent, "utf-8");
    return {
      success: true,
      message: `Removed marked code from ${filePath}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to modify ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export function removeMarkedCodeFromFiles(
  filePaths: string[],
  options: MarkerOptions,
  dryRun = false
): OperationResult[] {
  return filePaths.map((filePath) => removeMarkedCode(filePath, options, dryRun));
}

export function createMarkerOptions(feature: string): MarkerOptions {
  return {
    startMarker: `@catalyst:${feature}-start`,
    endMarker: `@catalyst:${feature}-end`,
  };
}

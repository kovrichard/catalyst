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
): { result: string; error?: string } {
  const lines = content.split("\n");
  const result: string[] = [];
  let insideMarker = false;
  let markerFound = false;
  let unclosedMarker = false;

  for (const line of lines) {
    if (line.includes(startMarker)) {
      if (insideMarker) {
        unclosedMarker = true; // Nested start marker
      }
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

  if (insideMarker || unclosedMarker) {
    return {
      result: content,
      error: `Unclosed marker: found '${startMarker}' without matching '${endMarker}'`,
    };
  }

  if (!markerFound) {
    return { result: content };
  }

  return { result: result.join("\n") };
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

    if (modifiedContent.error) {
      return {
        success: false,
        message: modifiedContent.error,
      };
    }

    if (content === modifiedContent.result) {
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

    writeFileSync(fullPath, modifiedContent.result, "utf-8");
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

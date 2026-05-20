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

  // Marker stripping leaves orphan blank lines where the block used to be.
  // Collapse runs of blanks, plus the single blank at block boundaries that
  // biome rejects (no empty line at the start or end of a block).
  const collapsed = result
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/([{(\[])\s*\n\s*\n/g, "$1\n")
    .replace(/\n\s*\n(\s*[)\]}])/g, "\n$1");
  return { result: collapsed };
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

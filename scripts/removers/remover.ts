import type { OperationResult } from "../types/operation-result";
import {
  createMarkerOptions,
  removeMarkedCodeFromFiles,
} from "../utils/code-modifications";
import { deleteDirectories, deleteFiles } from "../utils/file-operations";
import { uninstallPackages } from "../utils/uninstaller";

export interface RemoverConfig {
  featureName: string;
  filesToDelete?: string[];
  directoriesToDelete?: string[];
  filesToModify?: string[];
  packagesToUninstall?: string[];
}

export class Remover {
  private config: RemoverConfig;

  constructor(config: RemoverConfig) {
    this.config = config;
  }

  async run(dryRun = false): Promise<void> {
    const {
      featureName,
      filesToDelete,
      directoriesToDelete,
      filesToModify,
      packagesToUninstall,
    } = this.config;

    console.log(`Removing ${featureName} integration...`);
    if (dryRun) {
      console.log("(DRY RUN - no files will be modified)\n");
    }

    let deleteFileResults: OperationResult[] = [];
    let deleteDirectoryResults: OperationResult[] = [];
    let modifyFileResults: OperationResult[] = [];
    let uninstallPackageResults: OperationResult[] = [];

    if (filesToDelete) {
      console.log(`Deleting ${featureName} files:`);
      deleteFileResults = deleteFiles(filesToDelete, dryRun);
      deleteFileResults.forEach((result) => {
        if (result.success) {
          console.log(`  ✓ ${result.message}`);
        } else {
          console.log(`  ✗ ${result.message}`);
        }
      });
    }

    if (directoriesToDelete) {
      console.log(`Deleting ${featureName} directories:`);
      deleteDirectoryResults = deleteDirectories(directoriesToDelete, dryRun);
      deleteDirectoryResults.forEach((result) => {
        if (result.success) {
          console.log(`  ✓ ${result.message}`);
        } else {
          console.log(`  ✗ ${result.message}`);
        }
      });
    }

    if (filesToModify) {
      console.log(`Removing marked code from files:`);
      const markers = createMarkerOptions(featureName.toLowerCase());
      modifyFileResults = removeMarkedCodeFromFiles(filesToModify, markers, dryRun);
      modifyFileResults.forEach((result) => {
        if (result.success) {
          console.log(`  ✓ ${result.message}`);
        } else {
          console.log(`  ✗ ${result.message}`);
        }
      });
    }

    if (packagesToUninstall) {
      console.log(`Uninstalling ${featureName} packages:`);
      uninstallPackageResults = uninstallPackages(packagesToUninstall, dryRun);
      uninstallPackageResults.forEach((result) => {
        if (result.success) {
          console.log(`  ✓ ${result.message}`);
        } else {
          console.log(`  ✗ ${result.message}`);
        }
      });
    }

    const allFailed = [
      ...deleteFileResults,
      ...deleteDirectoryResults,
      ...modifyFileResults,
      ...uninstallPackageResults,
    ].filter((r) => !r.success);
    if (allFailed.length > 0) {
      console.log(`\n  Warning: ${allFailed.length} operation(s) failed.\n`);
    } else if (dryRun) {
      console.log("\n  DRY RUN - no files actually modified\n");
    } else {
      console.log(`\n  All ${featureName} code removed successfully.\n`);
    }
  }
}

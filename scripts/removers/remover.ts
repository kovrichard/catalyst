import {
  createMarkerOptions,
  removeMarkedCodeFromFiles,
} from "../utils/code-modifications";
import { deleteFiles } from "../utils/file-operations";
import { uninstallPackages } from "../utils/uninstaller";

export interface RemoverConfig {
  featureName: string;
  filesToDelete: string[];
  filesToModify: string[];
  packagesToUninstall: string[];
}

export class Remover {
  private config: RemoverConfig;

  constructor(config: RemoverConfig) {
    this.config = config;
  }

  async run(dryRun = false): Promise<void> {
    const { featureName, filesToDelete, filesToModify, packagesToUninstall } =
      this.config;

    console.log(`Removing ${featureName} integration...`);
    if (dryRun) {
      console.log("(DRY RUN - no files will be modified)\n");
    }

    console.log(`Deleting ${featureName} files:`);
    const deleteResults = deleteFiles(filesToDelete, dryRun);
    deleteResults.forEach((result) => {
      if (result.success) {
        console.log(`  ✓ ${result.message}`);
      } else {
        console.log(`  ✗ ${result.message}`);
      }
    });

    console.log(`Removing marked code from files:`);
    const markers = createMarkerOptions(featureName.toLowerCase());
    const modifyResults = removeMarkedCodeFromFiles(filesToModify, markers, dryRun);
    modifyResults.forEach((result) => {
      if (result.success) {
        console.log(`  ✓ ${result.message}`);
      } else {
        console.log(`  ✗ ${result.message}`);
      }
    });

    console.log(`Uninstalling ${featureName} packages:`);
    const uninstallResults = uninstallPackages(packagesToUninstall, dryRun);
    uninstallResults.forEach((result) => {
      if (result.success) {
        console.log(`  ✓ ${result.message}`);
      } else {
        console.log(`  ✗ ${result.message}`);
      }
    });

    const allFailed = [...deleteResults, ...modifyResults].filter((r) => !r.success);
    if (allFailed.length > 0) {
      console.log(`\n  Warning: ${allFailed.length} operation(s) failed.\n`);
    } else if (dryRun) {
      console.log("\n  DRY RUN - no files actually modified\n");
    } else {
      console.log(`\n  All ${featureName} code removed successfully.\n`);
    }
  }
}

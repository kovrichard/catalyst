import {
  createMarkerOptions,
  removeMarkedCodeFromFiles,
} from "../utils/code-modifications";
import { deleteFiles } from "../utils/file-operations";
import { uninstallPackages } from "../utils/uninstaller";

const REDIS_FILES_TO_DELETE = [
  "src/lib/cache/redis.ts",
  "src/lib/prisma/cache-plugin.ts",
];

const REDIS_FILES_TO_MODIFY = ["src/lib/config.ts", "src/lib/prisma/prisma.ts"];

const REDIS_PACKAGES_TO_UNINSTALL = ["ioredis"];

export async function removeRedis(dryRun = false): Promise<void> {
  console.log("Removing Redis integration...");
  if (dryRun) {
    console.log("(DRY RUN - no files will be modified)\n");
  }

  console.log("Deleting Redis files:");
  const deleteResults = deleteFiles(REDIS_FILES_TO_DELETE, dryRun);
  deleteResults.forEach((result) => {
    if (result.success) {
      console.log(`  ✓ ${result.message}`);
    } else {
      console.log(`  ✗ ${result.message}`);
    }
  });

  console.log("Removing marked code from files:");
  const redisMarkers = createMarkerOptions("redis");
  const modifyResults = removeMarkedCodeFromFiles(
    REDIS_FILES_TO_MODIFY,
    redisMarkers,
    dryRun
  );
  modifyResults.forEach((result) => {
    if (result.success) {
      console.log(`  ✓ ${result.message}`);
    } else {
      console.log(`  ✗ ${result.message}`);
    }
  });

  console.log("Uninstalling Redis packages:");
  const uninstallResults = uninstallPackages(REDIS_PACKAGES_TO_UNINSTALL, dryRun);
  uninstallResults.forEach((result) => {
    if (result.success) {
      console.log(`  ✓ ${result.message}`);
    } else {
      console.log(`  ✗ ${result.message}`);
    }
  });

  const allFailed = [...deleteResults, ...modifyResults].filter((r) => !r.success);
  if (allFailed.length > 0) {
    console.log(`\n  Warning: ${allFailed.length} operation(s) failed.`);
  } else if (dryRun) {
    console.log("\n  DRY RUN - no files actually modified");
  } else {
    console.log("\n  All Redis code removed successfully.");
  }
}

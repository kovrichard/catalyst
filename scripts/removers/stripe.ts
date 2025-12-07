import {
  createMarkerOptions,
  removeMarkedCodeFromFiles,
} from "../utils/code-modifications";
import { deleteFiles } from "../utils/file-operations";
import { uninstallPackages } from "../utils/uninstaller";

const STRIPE_FILES_TO_DELETE = ["src/lib/stripe.ts", "src/app/api/stripe/route.ts"];

const STRIPE_FILES_TO_MODIFY = [
  "src/auth.ts",
  "src/lib/config.ts",
  "src/lib/trpc/routers/_app.ts",
  "src/components/sidebar/profile-menu.tsx",
];

const STRIPE_PACKAGES_TO_UNINSTALL = ["stripe"];

export async function removeStripe(dryRun = false): Promise<void> {
  console.log("Removing Stripe integration...");
  if (dryRun) {
    console.log("DRY RUN - no files will be modified\n");
  }

  console.log("Deleting Stripe files:");
  const deleteResults = deleteFiles(STRIPE_FILES_TO_DELETE, dryRun);
  deleteResults.forEach((result) => {
    if (result.success) {
      console.log(`  ✓ ${result.message}`);
    } else {
      console.log(`  ✗ ${result.message}`);
    }
  });

  console.log("\nRemoving marked code from files:");
  const stripeMarkers = createMarkerOptions("stripe");
  const modifyResults = removeMarkedCodeFromFiles(
    STRIPE_FILES_TO_MODIFY,
    stripeMarkers,
    dryRun
  );
  modifyResults.forEach((result) => {
    if (result.success) {
      console.log(`  ✓ ${result.message}`);
    } else {
      console.log(`  ✗ ${result.message}`);
    }
  });

  console.log("\nUninstalling Stripe packages:");
  const uninstallResults = uninstallPackages(STRIPE_PACKAGES_TO_UNINSTALL, dryRun);
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
    console.log("\n  All Stripe code removed successfully.");
  }
}

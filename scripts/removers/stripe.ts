import { deleteFiles } from "../utils/file-operations";

const STRIPE_FILES_TO_DELETE = ["src/lib/stripe.ts", "src/app/api/stripe/route.ts"];

export async function removeStripe(dryRun = false): Promise<void> {
  console.log("Removing Stripe integration...");
  if (dryRun) {
    console.log("DRY RUN - no files will be modified\n");
  } else {
    console.log("Deleting Stripe files...\n");
  }

  const results = deleteFiles(STRIPE_FILES_TO_DELETE, dryRun);

  results.forEach((result) => {
    if (result.success) {
      console.log(`  ✓ ${result.message}`);
    } else {
      console.log(`  ✗ ${result.message}`);
    }
  });

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    console.log(`\n  Warning: ${failed.length} file(s) could not be deleted.`);
  } else if (dryRun) {
    console.log("\n  DRY RUN - no files actually modified");
  } else {
    console.log("\n  All Stripe files deleted successfully.");
  }
}

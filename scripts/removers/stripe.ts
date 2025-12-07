import { deleteFiles } from "../utils/file-operations";

const STRIPE_FILES_TO_DELETE = ["src/lib/stripe.ts", "src/app/api/stripe/route.ts"];

export async function removeStripe(): Promise<void> {
  console.log("Removing Stripe integration...");
  console.log("Deleting Stripe files...\n");

  const results = deleteFiles(STRIPE_FILES_TO_DELETE);

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
  } else {
    console.log("\n  All Stripe files deleted successfully.");
  }
}

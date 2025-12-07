import { Remover } from "./remover";

const STRIPE_FILES_TO_DELETE = ["src/lib/stripe.ts", "src/app/api/stripe/route.ts"];

const STRIPE_FILES_TO_MODIFY = [
  "src/auth.ts",
  "src/lib/config.ts",
  "src/lib/trpc/routers/_app.ts",
  "src/components/sidebar/profile-menu.tsx",
];

const STRIPE_PACKAGES_TO_UNINSTALL = ["stripe"];

const remover = new Remover({
  featureName: "Stripe",
  filesToDelete: STRIPE_FILES_TO_DELETE,
  filesToModify: STRIPE_FILES_TO_MODIFY,
  packagesToUninstall: STRIPE_PACKAGES_TO_UNINSTALL,
});

export async function removeStripe(dryRun = false): Promise<void> {
  await remover.run(dryRun);
}

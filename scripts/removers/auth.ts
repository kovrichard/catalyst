import { Remover } from "./remover";
import { removeStripe } from "./stripe";

const AUTH_FILES_TO_DELETE = [
  "src/auth.ts",
  "src/types/auth.ts",
  "src/types/user.ts",
  "src/lib/dao/users.ts",
  "src/lib/dao/notifications.ts",
  "src/lib/actions/users.ts",
  "src/lib/actions/notifications.ts",
  "src/lib/services/user.service.ts",
  "src/lib/services/notification.service.ts",
  "src/lib/auth-client.ts",
  "src/lib/turnstile.ts",
  "src/hooks/use-toast.tsx",
  "src/components/top-menu.tsx",
];

const AUTH_FOLDERS_TO_DELETE = [
  "src/app/(public)/login",
  "src/app/(public)/register",
  "src/app/(public)/reset-password",
  "src/app/(protected)",
  "src/app/api/auth",
  "src/components/auth",
  "src/components/notifications",
  "src/components/settings",
  "src/components/sidebar",
];

const AUTH_FILES_TO_MODIFY = [
  "src/app/(public)/layout.tsx",
  "src/lib/config.ts",
  "src/lib/public-config.ts",
  "src/lib/utils.ts",
  "src/app/sitemap.ts",
  "src/lib/trpc/init.ts",
  "src/lib/trpc/server.tsx",
  "src/app/api/trpc/[trpc]/route.ts",
];

const AUTH_PACKAGES_TO_UNINSTALL = [
  "better-auth",
  "@hookform/resolvers",
  "@marsidev/react-turnstile",
  "react-hook-form",
  "javascript-time-ago",
];

const remover = new Remover({
  featureName: "Auth",
  filesToDelete: AUTH_FILES_TO_DELETE,
  directoriesToDelete: AUTH_FOLDERS_TO_DELETE,
  filesToModify: AUTH_FILES_TO_MODIFY,
  packagesToUninstall: AUTH_PACKAGES_TO_UNINSTALL,
});

export async function removeAuth(dryRun = false): Promise<void> {
  await remover.run(dryRun);
  await removeStripe(dryRun);
}

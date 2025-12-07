import { Remover } from "./remover";

const AUTH_FILES_TO_DELETE = [
  "src/auth.ts",
  "src/types/auth.ts",
  "src/lib/dao/users.ts",
  "src/lib/dao/notifications.ts",
  "src/lib/actions/users.ts",
  "src/lib/actions/notifications.ts",
  "src/lib/services/user.service.ts",
  "src/lib/services/notification.service.ts",
];

const AUTH_FOLDERS_TO_DELETE = [
  "src/app/(public)/login",
  "src/app/(public)/register",
  "src/components/auth",
  "src/app/api/auth",
  "src/app/(public)/reset-password",
];

const AUTH_FILES_TO_MODIFY = [
  "src/app/(public)/layout.tsx",
  "src/app/(protected)/layout.tsx",
  "src/components/top-menu.tsx",
  "src/components/sidebar/app-sidebar.tsx",
  "src/lib/config.ts",
  "src/app/sitemap.ts",
];

const AUTH_PACKAGES_TO_UNINSTALL = ["better-auth"];

const remover = new Remover({
  featureName: "Auth",
  filesToDelete: AUTH_FILES_TO_DELETE,
  directoriesToDelete: AUTH_FOLDERS_TO_DELETE,
  filesToModify: AUTH_FILES_TO_MODIFY,
  packagesToUninstall: AUTH_PACKAGES_TO_UNINSTALL,
});

export async function removeAuth(dryRun = false): Promise<void> {
  await remover.run(dryRun);
}

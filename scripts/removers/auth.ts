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

// TODO: when a dedicated removeTrpc toggle is added, move the tRPC paths
// (src/lib/trpc, src/app/api/trpc) out of this remover.
const AUTH_FOLDERS_TO_DELETE = [
  "src/app/(public)/login",
  "src/app/(public)/register",
  "src/app/(public)/reset-password",
  "src/app/(protected)",
  "src/app/api/auth",
  "src/app/api/trpc",
  "src/components/auth",
  "src/components/notifications",
  "src/components/settings",
  "src/components/sidebar",
  "src/lib/trpc",
];

const AUTH_FILES_TO_MODIFY = [
  "src/app/(public)/layout.tsx",
  "src/lib/config.ts",
  "src/lib/public-config.ts",
  "src/lib/utils.ts",
  "src/app/sitemap.ts",
  "src/components/providers.tsx",
];

// TODO: when a dedicated removeTrpc toggle is added, move the tRPC + React
// Query packages out of this remover.
const AUTH_PACKAGES_TO_UNINSTALL = [
  "better-auth",
  "@hookform/resolvers",
  "@marsidev/react-turnstile",
  "react-hook-form",
  "javascript-time-ago",
  "@tanstack/react-query",
  "@tanstack/react-query-persist-client",
  "@trpc/client",
  "@trpc/server",
  "@trpc/tanstack-react-query",
  "idb-keyval",
  "superjson",
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

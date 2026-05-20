import { Remover } from "./remover";

const TRPC_FOLDERS_TO_DELETE = ["src/lib/trpc", "src/app/api/trpc"];

const TRPC_FILES_TO_MODIFY = ["src/components/providers.tsx"];

const TRPC_PACKAGES_TO_UNINSTALL = [
  "@tanstack/react-query",
  "@tanstack/react-query-persist-client",
  "@trpc/client",
  "@trpc/server",
  "@trpc/tanstack-react-query",
  "idb-keyval",
  "superjson",
];

const remover = new Remover({
  featureName: "tRPC",
  directoriesToDelete: TRPC_FOLDERS_TO_DELETE,
  filesToModify: TRPC_FILES_TO_MODIFY,
  packagesToUninstall: TRPC_PACKAGES_TO_UNINSTALL,
});

export async function removeTrpc(dryRun = false): Promise<void> {
  await remover.run(dryRun);
}

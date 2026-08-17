import { Remover } from "./remover";

const MCP_FILES_TO_DELETE = [
  "src/lib/dao/mcp.ts",
  "src/lib/actions/api-keys.ts",
  "src/types/api-key.ts",
  "src/components/settings/api-keys-card.tsx",
  "src/components/settings/api-keys-skeleton.tsx",
  "src/components/settings/api-key-created-modal.tsx",
];

const MCP_FOLDERS_TO_DELETE = ["src/lib/mcp", "src/app/api/mcp"];

const MCP_FILES_TO_MODIFY = [
  "src/auth.ts",
  "prisma/schema.prisma",
  "src/app/(protected)/settings/page.tsx",
];

const MCP_PACKAGES_TO_UNINSTALL = [
  "mcp-handler",
  "@modelcontextprotocol/server",
  "@better-auth/api-key",
];

const remover = new Remover({
  featureName: "MCP",
  filesToDelete: MCP_FILES_TO_DELETE,
  directoriesToDelete: MCP_FOLDERS_TO_DELETE,
  filesToModify: MCP_FILES_TO_MODIFY,
  packagesToUninstall: MCP_PACKAGES_TO_UNINSTALL,
});

export async function removeMcp(dryRun = false): Promise<void> {
  await remover.run(dryRun);
}

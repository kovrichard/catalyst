import { removeAuth } from "./auth";
import { Remover } from "./remover";

const DB_FILES_TO_DELETE = ["prisma.config.ts"];

const DB_FOLDERS_TO_DELETE = ["prisma", "src/lib/prisma"];

const DB_FILES_TO_MODIFY = ["Dockerfile", "docker-compose.yml"];

const DB_PACKAGES_TO_UNINSTALL = ["@prisma/adapter-pg", "@prisma/client", "prisma"];

const remover = new Remover({
  featureName: "Database",
  filesToDelete: DB_FILES_TO_DELETE,
  directoriesToDelete: DB_FOLDERS_TO_DELETE,
  filesToModify: DB_FILES_TO_MODIFY,
  packagesToUninstall: DB_PACKAGES_TO_UNINSTALL,
});

export async function removeDatabase(dryRun = false): Promise<void> {
  await remover.run(dryRun);
  await removeAuth(dryRun);
}

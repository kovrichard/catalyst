import { Remover } from "./remover";

const REDIS_FILES_TO_DELETE = [
  "src/lib/cache/redis.ts",
  "src/lib/prisma/cache-plugin.ts",
];

const REDIS_FILES_TO_MODIFY = ["src/lib/config.ts", "src/lib/prisma/prisma.ts"];

const REDIS_PACKAGES_TO_UNINSTALL = ["ioredis"];

const remover = new Remover({
  featureName: "Redis",
  filesToDelete: REDIS_FILES_TO_DELETE,
  filesToModify: REDIS_FILES_TO_MODIFY,
  packagesToUninstall: REDIS_PACKAGES_TO_UNINSTALL,
});

export async function removeRedis(dryRun = false): Promise<void> {
  await remover.run(dryRun);
}

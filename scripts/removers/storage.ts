import { Remover } from "./remover";

const STORAGE_FILES_TO_DELETE = ["src/lib/actions/uploads.ts", "tests/file-keys.test.ts"];

const STORAGE_FOLDERS_TO_DELETE = ["src/lib/storage", "src/app/api/files"];

const STORAGE_FILES_TO_MODIFY = ["src/lib/config.ts", "tests/env.fixture"];

const STORAGE_PACKAGES_TO_UNINSTALL = [
  "@aws-sdk/client-s3",
  "@aws-sdk/s3-request-presigner",
  "@aws-sdk/cloudfront-signer",
];

const remover = new Remover({
  featureName: "Storage",
  filesToDelete: STORAGE_FILES_TO_DELETE,
  directoriesToDelete: STORAGE_FOLDERS_TO_DELETE,
  filesToModify: STORAGE_FILES_TO_MODIFY,
  packagesToUninstall: STORAGE_PACKAGES_TO_UNINSTALL,
});

export async function removeStorage(dryRun = false): Promise<void> {
  await remover.run(dryRun);
}

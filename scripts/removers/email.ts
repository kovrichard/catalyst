import { Remover } from "./remover";

const EMAIL_FOLDERS_TO_DELETE = ["src/lib/aws", "emails"];

const EMAIL_FILES_TO_MODIFY = ["src/auth.ts", "src/lib/config.ts"];

const EMAIL_PACKAGES_TO_UNINSTALL = [
  "@aws-sdk/client-ses",
  "@react-email/components",
  "@react-email/preview-server",
  "react-email",
];

const EMAIL_SCRIPTS_TO_REMOVE = ["dev-email"];

const remover = new Remover({
  featureName: "Email",
  directoriesToDelete: EMAIL_FOLDERS_TO_DELETE,
  filesToModify: EMAIL_FILES_TO_MODIFY,
  packagesToUninstall: EMAIL_PACKAGES_TO_UNINSTALL,
  scriptsToRemove: EMAIL_SCRIPTS_TO_REMOVE,
});

export async function removeEmail(dryRun = false): Promise<void> {
  await remover.run(dryRun);
}

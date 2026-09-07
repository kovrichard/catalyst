export const VERSION_POLL_INTERVAL_MS = 60_000;

// Any change counts, not just an increase: the identifier is Next's opaque build
// id, and a rollback also leaves an open tab running stale code.
export function shouldPromptReload({
  loadedVersion,
  servedVersion,
  alreadyPrompted,
}: Readonly<{
  loadedVersion: string | null;
  servedVersion: string | null;
  alreadyPrompted: boolean;
}>): boolean {
  if (alreadyPrompted || !loadedVersion || !servedVersion) {
    return false;
  }
  return loadedVersion !== servedVersion;
}

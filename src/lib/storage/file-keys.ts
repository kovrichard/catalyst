export function userFileKey(userId: string, fileId: string): string {
  return `${userId}/${fileId}`;
}

// A user may only reach objects sitting under their own id prefix. Rejects
// empty keys, empty users, and any path-traversal segment as defense in depth.
export function isOwnedFileKey(key: string, userId: string): boolean {
  if (!key || !userId) {
    return false;
  }

  const segments = key.split("/");
  if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) {
    return false;
  }

  return key.startsWith(`${userId}/`);
}

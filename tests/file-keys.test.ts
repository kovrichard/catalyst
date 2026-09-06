import { describe, expect, it } from "bun:test";
import { isOwnedFileKey, userFileKey } from "@/lib/storage/file-keys";

const userId = "user_1";

describe("userFileKey", () => {
  it("prefixes the file id with the owning user id", () => {
    expect(userFileKey(userId, "file_1")).toBe("user_1/file_1");
  });

  it("produces a key its own owner passes the ownership check with", () => {
    expect(isOwnedFileKey(userFileKey(userId, "file_1"), userId)).toBe(true);
  });
});

describe("isOwnedFileKey", () => {
  it("accepts a key under the user's own prefix", () => {
    expect(isOwnedFileKey("user_1/file_1", userId)).toBe(true);
  });

  it("accepts nested keys under the user's own prefix", () => {
    expect(isOwnedFileKey("user_1/folder/file_1", userId)).toBe(true);
  });

  it("rejects a key belonging to another user", () => {
    expect(isOwnedFileKey("user_2/file_1", userId)).toBe(false);
  });

  it("rejects a user id that is only a prefix of the owning segment", () => {
    expect(isOwnedFileKey("user_10/file_1", userId)).toBe(false);
  });

  it("rejects parent-directory traversal segments", () => {
    expect(isOwnedFileKey("user_1/../user_2/file_1", userId)).toBe(false);
  });

  it("rejects current-directory segments", () => {
    expect(isOwnedFileKey("user_1/./file_1", userId)).toBe(false);
  });

  it("rejects empty path segments", () => {
    expect(isOwnedFileKey("user_1//file_1", userId)).toBe(false);
  });

  it("rejects an empty key", () => {
    expect(isOwnedFileKey("", userId)).toBe(false);
  });

  it("rejects an empty user id", () => {
    expect(isOwnedFileKey("user_1/file_1", "")).toBe(false);
  });

  it("rejects the bare prefix with no file", () => {
    expect(isOwnedFileKey("user_1/", userId)).toBe(false);
  });
});

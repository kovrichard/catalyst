// Governs when an open tab is told to reload. The costly failure is a false
// positive — nagging a user whose page is already current — so every "no
// baseline yet" and "check failed" path must stay silent.
// Break-verify: flipping the `!loadedVersion` guard reds "stays silent until a
// baseline exists".

import { describe, expect, test } from "bun:test";
import { shouldPromptReload } from "../src/lib/utils/version-check";

const BASE = {
  loadedVersion: "build-a",
  servedVersion: "build-a",
  alreadyPrompted: false,
};

describe("shouldPromptReload", () => {
  test("prompts once the served build differs from the loaded one", () => {
    expect(shouldPromptReload({ ...BASE, servedVersion: "build-b" })).toBe(true);
  });

  test("stays silent while the served build matches", () => {
    expect(shouldPromptReload(BASE)).toBe(false);
  });

  test("stays silent until a baseline exists", () => {
    expect(
      shouldPromptReload({ ...BASE, loadedVersion: null, servedVersion: "build-b" })
    ).toBe(false);
  });

  test("stays silent when the check came back empty", () => {
    expect(shouldPromptReload({ ...BASE, servedVersion: null })).toBe(false);
  });

  test("never prompts twice for the same page load", () => {
    expect(
      shouldPromptReload({ ...BASE, servedVersion: "build-b", alreadyPrompted: true })
    ).toBe(false);
  });

  test("prompts on a rollback too, not only on a newer build", () => {
    expect(
      shouldPromptReload({
        loadedVersion: "build-9",
        servedVersion: "build-2",
        alreadyPrompted: false,
      })
    ).toBe(true);
  });

  test("treats an empty string as no version rather than a change", () => {
    expect(shouldPromptReload({ ...BASE, servedVersion: "" })).toBe(false);
    expect(shouldPromptReload({ ...BASE, loadedVersion: "" })).toBe(false);
  });
});

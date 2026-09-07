// End-to-end wiring of the checker: it must baseline on the first check rather
// than toast immediately, then prompt exactly once when the served build moves.
// The visibilitychange listener drives the checks here so the test doesn't wait
// out the poll interval.
// Break-verify: removing the "baseline on first check" branch reds "does not
// prompt on the very first check".

import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { registerDom } from "./helpers/dom";

registerDom();

const { cleanup, render, waitFor } = await import("@testing-library/react");

const toasts: { title: string; hasReloadAction: boolean }[] = [];

void mock.module("sonner", () => ({
  toast: {
    info: (title: string, options?: { action?: { label: string } }) => {
      toasts.push({ title, hasReloadAction: options?.action?.label === "Reload" });
    },
  },
}));

const { VersionChecker } = await import("../src/components/version-checker");

let servedVersion: string | null = "build-a";
let requestCount = 0;
let failRequest = false;

beforeEach(() => {
  toasts.length = 0;
  servedVersion = "build-a";
  requestCount = 0;
  failRequest = false;
  globalThis.fetch = (async () => {
    requestCount += 1;
    if (failRequest) {
      throw new Error("offline");
    }
    return {
      ok: true,
      json: async () => ({ version: servedVersion }),
    } as Response;
  }) as unknown as typeof fetch;
});

afterEach(cleanup);

function recheck() {
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("VersionChecker", () => {
  test("does not prompt on the very first check", async () => {
    render(<VersionChecker />);
    await waitFor(() => expect(requestCount).toBe(1));
    expect(toasts).toHaveLength(0);
  });

  test("prompts with a Reload action once the served build changes", async () => {
    render(<VersionChecker />);
    await waitFor(() => expect(requestCount).toBe(1));

    servedVersion = "build-b";
    recheck();

    await waitFor(() => expect(toasts).toHaveLength(1));
    expect(toasts[0].title).toContain("new version");
    expect(toasts[0].hasReloadAction).toBe(true);
  });

  test("prompts only once even as the build keeps moving", async () => {
    render(<VersionChecker />);
    await waitFor(() => expect(requestCount).toBe(1));

    servedVersion = "build-b";
    recheck();
    await waitFor(() => expect(toasts).toHaveLength(1));

    servedVersion = "build-c";
    recheck();
    await waitFor(() => expect(requestCount).toBeGreaterThan(2));

    expect(toasts).toHaveLength(1);
  });

  test("stays quiet while the build is unchanged", async () => {
    render(<VersionChecker />);
    await waitFor(() => expect(requestCount).toBe(1));

    recheck();
    await waitFor(() => expect(requestCount).toBe(2));

    expect(toasts).toHaveLength(0);
  });

  test("a failing check neither toasts nor throws", async () => {
    failRequest = true;
    render(<VersionChecker />);
    await waitFor(() => expect(requestCount).toBe(1));

    failRequest = false;
    servedVersion = "build-b";
    recheck();
    await waitFor(() => expect(requestCount).toBe(2));

    expect(toasts).toHaveLength(0);
  });

  test("stops checking once unmounted", async () => {
    const { unmount } = render(<VersionChecker />);
    await waitFor(() => expect(requestCount).toBe(1));

    unmount();
    recheck();

    expect(requestCount).toBe(1);
  });
});

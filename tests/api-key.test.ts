import { describe, expect, it } from "bun:test";
import { formatTimeAgo } from "@/lib/utils";
import { toApiKeySummary } from "@/types/api-key";

const base = { id: "key_1", name: "Agent", start: "cat_" };

describe("toApiKeySummary", () => {
  it("converts the ISO string Better Auth actually sends into a Date", () => {
    const summary = toApiKeySummary({
      ...base,
      lastRequest: "2026-08-17T12:55:32.875Z",
    });

    expect(summary.lastRequest).toBeInstanceOf(Date);
    expect(summary.lastRequest?.toISOString()).toBe("2026-08-17T12:55:32.875Z");
  });

  it("passes a real Date through unchanged", () => {
    const lastRequest = new Date("2026-08-17T12:55:32.875Z");
    const summary = toApiKeySummary({ ...base, lastRequest });

    expect(summary.lastRequest?.getTime()).toBe(lastRequest.getTime());
  });

  it("keeps a never-used key null", () => {
    expect(toApiKeySummary({ ...base, lastRequest: null }).lastRequest).toBeNull();
  });

  it("produces a value formatTimeAgo accepts", () => {
    const summary = toApiKeySummary({
      ...base,
      lastRequest: "2026-08-17T12:55:32.875Z",
    });

    expect(() => formatTimeAgo(summary.lastRequest as Date)).not.toThrow();
  });
});

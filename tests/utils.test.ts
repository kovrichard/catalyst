import { describe, expect, it } from "bun:test";
import { cn, ensure, formatTimeAgo, initialState } from "../src/lib/utils";

describe("cn", () => {
  it("joins plain class names", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("lets a later tailwind class win over an earlier conflicting one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("keeps non-conflicting tailwind classes side by side", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("drops falsy entries", () => {
    expect(cn("flex", false, null, undefined, "")).toBe("flex");
  });

  it("resolves conditional object syntax", () => {
    expect(cn({ flex: true, hidden: false })).toBe("flex");
  });

  it("flattens nested arrays", () => {
    expect(cn(["flex", ["gap-2"]])).toBe("flex gap-2");
  });

  it("returns an empty string when given nothing", () => {
    expect(cn()).toBe("");
  });
});

describe("ensure", () => {
  it("returns without throwing on a truthy condition", () => {
    expect(() => ensure(1, "boom")).not.toThrow();
  });

  it("throws with the given message on a falsy condition", () => {
    expect(() => ensure(0, "value was missing")).toThrow("value was missing");
  });

  it("treats an empty string as falsy", () => {
    expect(() => ensure("", "empty")).toThrow("empty");
  });

  it("treats a non-empty string as truthy", () => {
    expect(() => ensure("ok", "empty")).not.toThrow();
  });

  it("throws an Error instance", () => {
    expect(() => ensure(null, "nope")).toThrow(Error);
  });
});

describe("initialState", () => {
  it("starts with an empty message", () => {
    expect(initialState.message).toBe("");
  });

  it("starts with an empty description", () => {
    expect(initialState.description).toBe("");
  });

  it("leaves success undecided", () => {
    expect(initialState.success).toBeUndefined();
  });
});

describe("formatTimeAgo", () => {
  it("describes a moment seconds ago as just now", () => {
    expect(formatTimeAgo(new Date(Date.now() - 1000))).toBe("just now");
  });

  it("describes an hour back in hours", () => {
    expect(formatTimeAgo(new Date(Date.now() - 60 * 60 * 1000))).toBe("1 hour ago");
  });

  it("describes three days back in days", () => {
    expect(formatTimeAgo(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))).toBe(
      "3 days ago"
    );
  });

  it("describes a future moment with in", () => {
    expect(formatTimeAgo(new Date(Date.now() + 60 * 60 * 1000))).toBe("in 1 hour");
  });
});

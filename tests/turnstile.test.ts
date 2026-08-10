import { afterEach, describe, expect, it } from "bun:test";
import { turnstileFailedResponse, verifyTurnstile } from "../src/lib/turnstile";

const realFetch = globalThis.fetch;

type FetchStub = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

function stubFetch(stub: FetchStub): void {
  globalThis.fetch = stub as typeof globalThis.fetch;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("verifyTurnstile", () => {
  it("rejects a missing token without calling the network", async () => {
    let called = false;
    stubFetch(async () => {
      called = true;
      return jsonResponse({ success: true });
    });

    expect(await verifyTurnstile(undefined)).toBe(false);
    expect(called).toBe(false);
  });

  it("rejects an empty token without calling the network", async () => {
    let called = false;
    stubFetch(async () => {
      called = true;
      return jsonResponse({ success: true });
    });

    expect(await verifyTurnstile("")).toBe(false);
    expect(called).toBe(false);
  });

  it("accepts a token Cloudflare reports as successful", async () => {
    stubFetch(async () => jsonResponse({ success: true }));

    expect(await verifyTurnstile("token")).toBe(true);
  });

  it("rejects a token Cloudflare reports as unsuccessful", async () => {
    stubFetch(async () => jsonResponse({ success: false }));

    expect(await verifyTurnstile("token")).toBe(false);
  });

  it("rejects when the payload omits success", async () => {
    stubFetch(async () => jsonResponse({}));

    expect(await verifyTurnstile("token")).toBe(false);
  });

  it("rejects a truthy but non-boolean success value", async () => {
    stubFetch(async () => jsonResponse({ success: "yes" }));

    expect(await verifyTurnstile("token")).toBe(false);
  });

  it("rejects a non-ok HTTP response", async () => {
    stubFetch(async () => jsonResponse({ success: true }, 500));

    expect(await verifyTurnstile("token")).toBe(false);
  });

  it("rejects when the request throws", async () => {
    stubFetch(async () => {
      throw new Error("network down");
    });

    expect(await verifyTurnstile("token")).toBe(false);
  });

  it("posts the secret and response to Cloudflare's siteverify endpoint", async () => {
    let seenUrl = "";
    let seenMethod = "";
    let seenBody = "";
    let seenHeaders: Record<string, string> = {};
    stubFetch(async (input, init) => {
      seenUrl = String(input);
      seenMethod = String(init?.method);
      seenBody = String(init?.body);
      seenHeaders = (init?.headers ?? {}) as Record<string, string>;
      return jsonResponse({ success: true });
    });

    await verifyTurnstile("token-abc");

    expect(seenUrl).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    expect(seenMethod).toBe("POST");
    expect(seenHeaders["Content-Type"]).toBe("application/x-www-form-urlencoded");
    expect(seenBody).toContain("secret=test-turnstile-secret");
    expect(seenBody).toContain("response=token-abc");
  });
});

describe("turnstileFailedResponse", () => {
  it("reports failure", () => {
    expect(turnstileFailedResponse.success).toBe(false);
  });

  it("carries a message and a description", () => {
    expect(turnstileFailedResponse.message).toBe("Validation failed");
    expect(turnstileFailedResponse.description).toBe("Please verify you are human.");
  });
});

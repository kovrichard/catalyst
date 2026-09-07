import { describe, expect, it } from "bun:test";
import { getAuthenticatorName } from "@better-auth/passkey";
import { deviceLabel } from "@/components/settings/passkeys-card";

describe("getAuthenticatorName", () => {
  it("names a known authenticator model", () => {
    expect(getAuthenticatorName("bada5566-a7aa-401f-bd96-45619a55120d")).toBe(
      "1Password"
    );
  });

  it("returns undefined for the all-zero AAGUID Apple reports by default", () => {
    expect(getAuthenticatorName("00000000-0000-0000-0000-000000000000")).toBeUndefined();
  });

  it("returns undefined when the authenticator reported none", () => {
    expect(getAuthenticatorName(undefined)).toBeUndefined();
  });
});

describe("deviceLabel", () => {
  const cases: [string, string][] = [
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      "Safari on iOS",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Chrome on macOS",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
      "Edge on Windows",
    ],
    [
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      "Chrome on Android",
    ],
    [
      "Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
      "Firefox on Linux",
    ],
  ];

  it.each(cases)("labels %s", (userAgent, expected) => {
    expect(deviceLabel(userAgent)).toBe(expected);
  });

  it("falls back when nothing matches", () => {
    expect(deviceLabel("some-unknown-agent")).toBe("Browser on this device");
  });
});

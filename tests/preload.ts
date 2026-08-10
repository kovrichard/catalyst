import { mock } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Re-applies tests/env.fixture inside this worker, overwriting anything a
// developer's real .env leaked in through process inheritance (e.g. a
// mutation-testing worker spawned from an already-.env-loaded parent process
// — `bun test --env-file` alone can't unset a key the process already has).
function enforceEnvFixture() {
  const content = readFileSync(join(import.meta.dir, "env.fixture"), "utf-8");
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex);
    const value = line.slice(separatorIndex + 1);
    if (value === "@absent") {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

enforceEnvFixture();

// Next's "server-only" marker throws outside a React Server Component runtime.
// bun registers a synchronous factory before it resolves the returned promise, and
// bun does not settle a preload's top-level await before test files run.
void mock.module("server-only", () => ({}));

// next/font/google resolves real font files at build time, which doesn't exist
// under bun test. bun statically inspects the factory's own keys to validate
// named imports (Inter, JetBrains_Mono, ...), so a Proxy without an ownKeys
// trap reports no exports at all — list the fonts this repo actually imports.
const mockFontLoader = () => ({ className: "mock-font", variable: "--font-mock" });
void mock.module("next/font/google", () => ({
  Inter: mockFontLoader,
  JetBrains_Mono: mockFontLoader,
}));

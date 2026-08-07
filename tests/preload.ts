import { mock } from "bun:test";

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

const placeholders: Record<string, string> = {
  SCHEME: "http",
  AUTHORITY: "localhost:3000",
  LOG_LEVEL: "error",
  // @catalyst:redis-start
  // Present so `redisConfigured` is true: the suite exercises the configured path.
  // Redis itself is never reached — the client is created with `lazyConnect`.
  REDIS_HOST: "localhost",
  REDIS_PORT: "6380",
  REDIS_PASS: "test-redis-password-placeholder",
  // @catalyst:redis-end
  // @catalyst:auth-start
  TURNSTILE_SECRET_KEY: "test-turnstile-secret",
  // @catalyst:auth-end
};

for (const [key, value] of Object.entries(placeholders)) {
  process.env[key] = value;
}

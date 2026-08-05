import { mock } from "bun:test";

// Next's "server-only" marker throws outside a React Server Component runtime.
// bun registers a synchronous factory before it resolves the returned promise, and
// bun does not settle a preload's top-level await before test files run.
void mock.module("server-only", () => ({}));

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

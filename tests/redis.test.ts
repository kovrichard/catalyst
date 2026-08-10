import { afterAll, describe, expect, it } from "bun:test";
import type { Redis } from "ioredis";
import { getRedisClient, isRedisConnected } from "../src/lib/cache/redis";

function clientWithStatus(status: string): Redis {
  return { status } as Redis;
}

afterAll(() => {
  getRedisClient()?.disconnect();
});

describe("getRedisClient", () => {
  it("returns a client when redis is configured", () => {
    expect(getRedisClient()).not.toBeNull();
  });

  it("hands out one shared client", () => {
    expect(getRedisClient()).toBe(getRedisClient());
  });

  it("points the client at the configured host and port", () => {
    const client = getRedisClient();

    expect(client?.options.host).toBe("localhost");
    expect(client?.options.port).toBe(6380);
  });

  it("passes the configured password", () => {
    expect(getRedisClient()?.options.password).toBe("test-redis-password-placeholder");
  });

  it("connects lazily so no socket opens until a command runs", () => {
    expect(getRedisClient()?.options.lazyConnect).toBe(true);
  });

  it("caps retries per request", () => {
    expect(getRedisClient()?.options.maxRetriesPerRequest).toBe(3);
  });

  it("starts out waiting rather than connected", () => {
    expect(getRedisClient()?.status).toBe("wait");
  });
});

describe("isRedisConnected", () => {
  it("rejects a null client", () => {
    expect(isRedisConnected(null)).toBe(false);
  });

  it("accepts a client waiting to connect lazily", () => {
    expect(isRedisConnected(clientWithStatus("wait"))).toBe(true);
  });

  it("accepts a ready client", () => {
    expect(isRedisConnected(clientWithStatus("ready"))).toBe(true);
  });

  it("rejects a client mid-connect", () => {
    expect(isRedisConnected(clientWithStatus("connecting"))).toBe(false);
  });

  it("rejects a reconnecting client", () => {
    expect(isRedisConnected(clientWithStatus("reconnecting"))).toBe(false);
  });

  it("rejects a closed client", () => {
    expect(isRedisConnected(clientWithStatus("close"))).toBe(false);
  });

  it("rejects an ended client", () => {
    expect(isRedisConnected(clientWithStatus("end"))).toBe(false);
  });
});

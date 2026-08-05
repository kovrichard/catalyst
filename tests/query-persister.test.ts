import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { PersistedClient } from "@tanstack/react-query-persist-client";

const store = new Map<IDBValidKey, unknown>();
const calls: Array<{ op: string; key: IDBValidKey }> = [];

await mock.module("idb-keyval", () => ({
  set: async (key: IDBValidKey, value: unknown) => {
    calls.push({ op: "set", key });
    store.set(key, value);
  },
  get: async (key: IDBValidKey) => {
    calls.push({ op: "get", key });
    return store.get(key);
  },
  del: async (key: IDBValidKey) => {
    calls.push({ op: "del", key });
    store.delete(key);
  },
}));

const { createIDBPersister } = await import("../src/lib/trpc/query-persister");

function persistedClient(queryHash: string): PersistedClient {
  return {
    timestamp: 0,
    buster: "",
    clientState: { mutations: [], queries: [{ queryHash }] },
  } as unknown as PersistedClient;
}

beforeEach(() => {
  store.clear();
  calls.length = 0;
});

describe("createIDBPersister", () => {
  it("restores exactly what was persisted", async () => {
    const persister = createIDBPersister("catalyst-query-cache");
    const client = persistedClient("projects");

    await persister.persistClient(client);

    expect(await persister.restoreClient()).toEqual(client);
  });

  it("resolves to undefined when nothing was persisted", async () => {
    expect(await createIDBPersister("empty-cache").restoreClient()).toBeUndefined();
  });

  it("removes the persisted cache", async () => {
    const persister = createIDBPersister("catalyst-query-cache");
    await persister.persistClient(persistedClient("projects"));

    await persister.removeClient();

    expect(await persister.restoreClient()).toBeUndefined();
  });

  it("addresses the key it was given", async () => {
    await createIDBPersister("catalyst-query-cache").persistClient(
      persistedClient("projects")
    );

    expect(calls).toEqual([{ op: "set", key: "catalyst-query-cache" }]);
  });

  it("falls back to the reactQuery key", async () => {
    await createIDBPersister().persistClient(persistedClient("projects"));

    expect(calls).toEqual([{ op: "set", key: "reactQuery" }]);
  });

  it("keeps two persisters on different keys apart", async () => {
    const mine = createIDBPersister("mine");
    const yours = createIDBPersister("yours");

    await mine.persistClient(persistedClient("mine-query"));

    expect(await yours.restoreClient()).toBeUndefined();
    expect(await mine.restoreClient()).toBeDefined();
  });
});

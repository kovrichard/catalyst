import { describe, expect, it } from "bun:test";
import type { Query, QueryClient } from "@tanstack/react-query";
import { makeQueryClient } from "../src/lib/trpc/query-client";

type DehydratePredicate = (query: Query) => boolean;

function shouldDehydrateOf(client: QueryClient): DehydratePredicate {
  const predicate = client.getDefaultOptions().dehydrate?.shouldDehydrateQuery;
  if (!predicate) {
    throw new Error("makeQueryClient did not configure shouldDehydrateQuery");
  }
  return predicate as DehydratePredicate;
}

function settledQuery(
  client: QueryClient,
  key: string[],
  meta?: Record<string, unknown>
) {
  client.setQueryData(key, "value");
  const query = client.getQueryCache().find({ queryKey: key });
  if (!query) {
    throw new Error(`query ${key.join("/")} was not cached`);
  }
  if (meta) {
    query.setOptions({ ...query.options, meta });
  }
  return query as Query;
}

describe("makeQueryClient defaults", () => {
  it("keeps data fresh for fifteen seconds", () => {
    expect(makeQueryClient().getDefaultOptions().queries?.staleTime).toBe(15_000);
  });

  it("does not refetch on mount", () => {
    expect(makeQueryClient().getDefaultOptions().queries?.refetchOnMount).toBe(false);
  });

  it("serializes and deserializes through superjson", () => {
    const options = makeQueryClient().getDefaultOptions();
    const roundTripped = options.hydrate?.deserializeData?.(
      options.dehydrate?.serializeData?.({ at: new Date(0) })
    );

    expect(roundTripped.at).toBeInstanceOf(Date);
  });

  it("hands each call an independent client", () => {
    expect(makeQueryClient()).not.toBe(makeQueryClient());
  });
});

describe("shouldDehydrateQuery", () => {
  it("dehydrates a settled query", () => {
    const client = makeQueryClient();
    expect(shouldDehydrateOf(client)(settledQuery(client, ["settled"]))).toBe(true);
  });

  it("skips a query still pending", () => {
    const client = makeQueryClient();
    const query = settledQuery(client, ["pending"]);
    query.state = { ...query.state, status: "pending" };

    expect(shouldDehydrateOf(client)(query)).toBe(false);
  });

  it("skips a query that opted out of persistence", () => {
    const client = makeQueryClient();
    const query = settledQuery(client, ["opted-out"], { persist: false });

    expect(shouldDehydrateOf(client)(query)).toBe(false);
  });

  it("dehydrates a query that explicitly opted in", () => {
    const client = makeQueryClient();
    const query = settledQuery(client, ["opted-in"], { persist: true });

    expect(shouldDehydrateOf(client)(query)).toBe(true);
  });

  it("dehydrates a query whose meta says nothing about persistence", () => {
    const client = makeQueryClient();
    const query = settledQuery(client, ["unrelated-meta"], { source: "test" });

    expect(shouldDehydrateOf(client)(query)).toBe(true);
  });

  it("skips an errored query", () => {
    const client = makeQueryClient();
    const query = settledQuery(client, ["errored"]);
    query.state = { ...query.state, status: "error", error: new Error("boom") };

    expect(shouldDehydrateOf(client)(query)).toBe(false);
  });
});

// The root layout used to declare `alternates.canonical`, and Next merges
// metadata per key: any page that did not declare its own inherited the
// homepage URL verbatim. Every public page below "/" would have silently told
// Google it was a duplicate of the homepage.
//
// This walks the public routes rather than listing them, so a page added
// without a canonical fails here instead of silently deindexing itself.
// Break-verify: deleting `alternates` from any (public) page reds this.

import { describe, expect, it } from "bun:test";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/metadata";

const PUBLIC_ROUTE_GLOB = "src/app/(public)/**/page.tsx";

function routeOf(file: string): string {
  const segments = file
    .replace(/^src\/app/, "")
    .replace(/\/page\.tsx$/, "")
    .split("/")
    .filter((segment) => segment !== "" && !segment.startsWith("("));

  return `/${segments.join("/")}`;
}

async function publicPages(): Promise<{ file: string; route: string }[]> {
  const files: string[] = [];
  for await (const file of new Bun.Glob(PUBLIC_ROUTE_GLOB).scan(".")) {
    files.push(file);
  }
  return files.sort().map((file) => ({ file, route: routeOf(file) }));
}

const pages = await publicPages();

describe("canonical URLs", () => {
  it("finds public pages to check", () => {
    expect(pages.length).toBeGreaterThan(3);
  });

  // Pages declare the canonical either relative ("/pricing") or absolute; both
  // resolve against metadataBase, so compare the resolved URL rather than the
  // literal, and hold it to this origin so a canonical can never point off-site.
  it.each(pages)("$route declares itself canonical", async ({ file, route }) => {
    const { metadata } = (await import(`${process.cwd()}/${file}`)) as {
      metadata: Metadata;
    };

    const declared = metadata?.alternates?.canonical;
    expect(declared).toBeDefined();

    const resolved = new URL(String(declared), siteUrl);
    expect(resolved.origin).toBe(new URL(siteUrl).origin);
    expect(resolved.pathname).toBe(route);
  });
});

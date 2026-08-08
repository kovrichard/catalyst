// Google truncates titles past ~60 characters and descriptions past ~160 — a
// title/description that's technically present but oversized gets cut off
// mid-word in the search snippet, or (for a description under ~50 chars)
// looks thin enough that Google often rewrites it anyway.
//
// Pages marked `robots: { index: false }` are excluded: Google never renders
// their title/description as a snippet, so length and uniqueness don't apply.
//
// Every other public page must declare its own title and description —
// silently falling back to the root layout's generic ones means two
// unrelated pages ship identical, thin metadata to Google, which this test
// otherwise can't see since it only reads a page's own exported metadata.
// Break-verify: lengthening any declared title past 60 chars reds it;
// removing a page's title/description reds the dedicated-metadata test.

import { describe, expect, test } from "bun:test";
import type { Metadata } from "next";

const PUBLIC_ROUTE_GLOB = "src/app/(public)/**/page.tsx";

const TITLE_MAX = 60;
const DESCRIPTION_MIN = 50;
const DESCRIPTION_MAX = 160;

function isNoindexed(robots: Metadata["robots"]): boolean {
  if (typeof robots === "string") {
    return robots.includes("noindex");
  }
  if (robots && typeof robots === "object" && "index" in robots) {
    return robots.index === false;
  }
  return false;
}

async function publicPages(): Promise<string[]> {
  const files: string[] = [];
  for await (const file of new Bun.Glob(PUBLIC_ROUTE_GLOB).scan(".")) {
    files.push(file);
  }
  return files.sort();
}

const files = await publicPages();
const pages = (
  await Promise.all(
    files.map(async (file) => {
      const { metadata } = (await import(`${process.cwd()}/${file}`)) as {
        metadata: Metadata;
      };
      return {
        file,
        title: metadata?.title,
        description: metadata?.description,
        noindexed: isNoindexed(metadata?.robots),
      };
    })
  )
).filter((page) => !page.noindexed);

describe("meta lengths", () => {
  test("there are public pages to check", () => {
    expect(pages.length).toBeGreaterThan(3);
  });

  test.each(pages)("$file declares its own title and description", ({
    title,
    description,
  }) => {
    expect(typeof title).toBe("string");
    expect(typeof description).toBe("string");
  });

  const withTitle: { file: string; title: string }[] = pages.flatMap((p) =>
    typeof p.title === "string" ? [{ file: p.file, title: p.title }] : []
  );

  test.each(withTitle)("$file's title fits a search snippet", ({ title }) => {
    expect(title.length).toBeGreaterThan(0);
    expect(title.length).toBeLessThanOrEqual(TITLE_MAX);
  });

  test("declared titles are unique", () => {
    const titles = withTitle.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  const withDescription: { file: string; description: string }[] = pages.flatMap((p) =>
    typeof p.description === "string"
      ? [{ file: p.file, description: p.description }]
      : []
  );

  test.each(withDescription)("$file's description fits a search snippet", ({
    description,
  }) => {
    expect(description.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
    expect(description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
  });

  test("declared descriptions are unique", () => {
    const descriptions = withDescription.map((p) => p.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});

import { cacheLife } from "next/cache";

const REPO_OWNER = "kovrichard";
const REPO_NAME = "catalyst";
export const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

const STARS_ENDPOINT = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
const TRAILING_ZERO = /\.0$/;

export function formatStarCount(stars: number) {
  if (stars < 1000) {
    return String(stars);
  }

  const thousands = stars / 1000;
  const rounded = thousands < 10 ? thousands.toFixed(1) : String(Math.round(thousands));

  return `${rounded.replace(TRAILING_ZERO, "")}k`;
}

export async function getRepoStars(): Promise<number | null> {
  "use cache";
  cacheLife("hours");

  try {
    const response = await fetch(STARS_ENDPOINT, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) {
      return null;
    }

    const repo = (await response.json()) as { stargazers_count?: unknown };

    return typeof repo.stargazers_count === "number" ? repo.stargazers_count : null;
  } catch {
    return null;
  }
}

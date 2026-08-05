import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import conf from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("days");

  const lastModified = new Date();

  return [
    {
      url: `${conf.host}/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 1,
    },
    // @catalyst:auth-start
    {
      url: `${conf.host}/login`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${conf.host}/register`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    // @catalyst:auth-end
  ];
}

import type { MetadataRoute } from "next";
import publicConf from "@/lib/public-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${publicConf.host}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${publicConf.host}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${publicConf.host}/register`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];
}

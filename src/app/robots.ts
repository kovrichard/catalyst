import type { MetadataRoute } from "next";
import conf from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${conf.host}/sitemap.xml`,
  };
}

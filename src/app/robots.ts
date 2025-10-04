import type { MetadataRoute } from "next";
import publicConf from "@/lib/public-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${publicConf.host}/sitemap.xml`,
  };
}

import publicConf from "@/lib/public-config";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${publicConf.host}/sitemap.xml`,
  };
}

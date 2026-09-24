import type { MetadataRoute } from "next";
import { metaDescription } from "@/lib/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Catalyst - Next.js Starter Kit",
    short_name: "Catalyst",
    description: metaDescription,
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

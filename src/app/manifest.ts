import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Catalyst - Next.js Starter Kit",
    short_name: "Catalyst",
    description:
      "Catalyst is a Next.js starter kit that helps you build modern web applications faster and easier than ever before.",
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

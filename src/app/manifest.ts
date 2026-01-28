import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Boring Template",
    short_name: "Template",
    description:
      "A starter template with authentication and database integration",
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: "#0a0a0a",
    background_color: "#0a0a0a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon"
      },
      {
        src: "icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    categories: ["productivity"]
  }
}

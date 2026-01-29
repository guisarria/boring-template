import type { Metadata } from "next/types"
import { env } from "@/lib/env"

export const baseUrl =
  process.env.NODE_ENV === "development"
    ? new URL("http://localhost:3000")
    : new URL(env.NEXT_PUBLIC_SERVER_URL)

export function createMetadata(override: Metadata): Metadata {
  let title = "Boring Template"
  if (typeof override.title === "string") {
    title = override.title
  } else if (
    override.title &&
    typeof override.title === "object" &&
    "default" in override.title
  ) {
    title = override.title.default
  }

  const description = override.description ?? "A clean, minimal starting point."

  const image = `${baseUrl.origin}/api/og?title=${encodeURIComponent(
    title
  )}&description=${encodeURIComponent(description)}`

  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: baseUrl.origin,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      siteName: "Boring Template",
      ...override.openGraph
    },
    twitter: {
      card: "summary_large_image",
      creator: "@guisarria",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: [image],
      ...override.twitter
    }
  }
}

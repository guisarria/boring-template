import type { Metadata } from "next/types"
import { env } from "@/lib/env"

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "",
      images: "",
      siteName: "Boring Template",
      ...override.openGraph
    },
    twitter: {
      card: "summary_large_image",
      creator: "",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: "",
      ...override.twitter
    }
  }
}

export const baseUrl =
  process.env.NODE_ENV === "development"
    ? new URL("http://localhost:3000")
    : new URL(`https://${env.BETTER_AUTH_URL}`)

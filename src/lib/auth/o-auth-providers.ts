import type { ComponentProps, ElementType } from "react"
import { GitHubIcon } from "@/components/ui/icons"

export const SUPPORTED_OAUTH_PROVIDERS = ["github"] as const
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number]

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<"svg">> }
> = {
  github: { name: "GitHub", Icon: GitHubIcon }
}

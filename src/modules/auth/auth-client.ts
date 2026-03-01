import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { env } from "@/core/env/client"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
})

"use client"

import { createAuthClient } from "better-auth/react"
import { useMemo } from "react"

import { OAUTH_PROVIDERS } from "@/lib/auth/o-auth-providers"
import { BetterAuthActionButton } from "../better-auth-action-button"

export function SocialButtons() {
  const authClient = useMemo(() => createAuthClient(), [])

  return (
    <div className="flex w-md flex-col items-center justify-center gap-2 sm:flex-row">
      {OAUTH_PROVIDERS.map(({ id, name, Icon }) => (
        <BetterAuthActionButton
          action={() =>
            authClient.signIn.social({
              provider: id,
              callbackURL: "/dashboard"
            })
          }
          className="w-full sm:w-auto sm:flex-1"
          key={id}
        >
          <Icon />
          Continue with {name}
        </BetterAuthActionButton>
      ))}
    </div>
  )
}

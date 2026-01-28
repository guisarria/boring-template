"use client"

import { createAuthClient } from "better-auth/react"
import { Button } from "@/components/ui/button"
import { GitHubIcon, GoogleIcon } from "@/components/ui/icons"

type SocialButtonsProps = {
  callbackURL?: string
}

export function SocialButtons({
  callbackURL = "/dashboard"
}: SocialButtonsProps) {
  const authClient = createAuthClient()

  const signInGitHub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL
    })
  }

  const signInGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL
    })
  }

  return (
    <div className="flex gap-2">
      <Button
        className="flex-1"
        onClick={signInGitHub}
        type="button"
        variant="outline"
      >
        <GitHubIcon />
        Continue with GitHub
      </Button>
      <Button
        className="flex-1"
        onClick={signInGoogle}
        type="button"
        variant="outline"
      >
        <GoogleIcon />
        Continue with Google
      </Button>
    </div>
  )
}

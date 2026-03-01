"use server"

import { headers } from "next/headers"
import { publicAction } from "@/core/dal"
import { db } from "@/db"
import { userSettings } from "@/modules/users/schema"
import { auth } from "./auth"
import type { User } from "./types"
import type { SignIn } from "./validations/sign-in"
import type { SignUp } from "./validations/sign-up"

type AuthResult = {
  redirect: boolean
  token: string
  url?: string
  user: User
}

type SignUpResult =
  | AuthResult
  | {
      user: User
    }

export async function signInUser({ email, password }: SignIn) {
  return await publicAction(async () => {
    const response = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    })
    return response satisfies AuthResult
  })
}

export async function signUpUser({ name, email, password }: SignUp) {
  return await publicAction(async () => {
    const response = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    })
    const result = response satisfies SignUpResult

    await db
      .insert(userSettings)
      .values({
        userId: result.user.id,
        theme: "system" as const,
        language: "en" as const,
        emailNotifications: true,
        privateAccount: false,
      })
      .returning()

    return result
  })
}

export async function signUpUsername(
  email: string,
  password: string,
  name: string,
  username: string,
) {
  return await publicAction(async () => {
    await auth.api.signUpEmail({
      body: { email, name, password, username },
    })
    return { message: "Signed up successfully" }
  })
}

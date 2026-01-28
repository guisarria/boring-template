"use server"

import { eq } from "drizzle-orm"
import { fromPromise } from "neverthrow"
import { cacheLife, cacheTag } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import { db } from "@/db"
import { userSettings } from "@/db/schemas/user-settings"
import { users } from "@/db/schemas/users"
import { auth } from "@/lib/auth/auth"
import {
  appErrors,
  runDbOperation,
  serialize,
  withAuth
} from "@/lib/dal/helpers"
import type { User } from "@/types/auth-types"

type AuthResult = {
  redirect: boolean
  token: string
  url?: string
  user: User
}

type SignUpResult =
  | AuthResult
  | {
      token: null
      user: User
    }

export async function signInUser(email: string, password: string) {
  const result = runDbOperation(async () => {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password
      },
      headers: await headers()
    })
    return response as AuthResult
  })

  return serialize(result)
}

export async function signUpUser(
  name: string,
  email: string,
  password: string
) {
  const authResult = await runDbOperation(async () => {
    const response = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password
      },
      headers: await headers()
    })
    return response as SignUpResult
  })

  if (authResult.isErr()) {
    return { success: false as const, error: authResult.error }
  }

  const userSettingsResult = runDbOperation(async () => {
    const newSettings = {
      userId: authResult.value.user.id,
      theme: "system" as const,
      language: "en" as const,
      emailNotifications: true,
      privateAccount: false
    }
    return await db.insert(userSettings).values(newSettings).returning()
  })

  return serialize(userSettingsResult.map(() => authResult.value))
}

export async function getUserSettings(userId: string) {
  const result = withAuth(async () => {
    const settings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
    return settings
  })

  return serialize(result)
}

export async function updatePublicUserSettings(user: User, isPrivate: boolean) {
  const result = withAuth(async () => {
    return await db
      .update(userSettings)
      .set({
        privateAccount: isPrivate
      })
      .where(eq(userSettings.userId, user.id))
      .returning()
  })

  return serialize(result)
}

export const getUserByUsername = cache(
  async <const T extends { [K in keyof typeof users.$inferSelect]?: boolean }>(
    username: string,
    columns?: T
  ) => {
    "use cache"
    cacheTag(`users:${username}`)
    cacheLife("minutes")

    const result = runDbOperation(() =>
      db.query.users.findFirst({
        columns,
        where: eq(users.username, username.toLowerCase())
      })
    )

    return serialize(result)
  }
)

export async function signUpUsername(
  email: string,
  password: string,
  name: string,
  username: string
) {
  const result = fromPromise(
    auth.api.signUpEmail({
      body: {
        email,
        name,
        password,
        username
      }
    }),
    appErrors.unexpected
  )

  return serialize(result.map(() => ({ message: "Signed up successfully" })))
}

async function getSessionFromHeaders() {
  const h = await headers()
  return auth.api.getSession({ headers: h })
}

export const getCurrentUser = cache(async () => {
  const session = await getSessionFromHeaders()
  return session?.user
})

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }
  return user
}

export const getServerSession = cache(async () => {
  "use cache: private"
  cacheLife("minutes")
  cacheTag("user-session")

  return await getSessionFromHeaders()
})

export const serverActiveSessions = cache(async () => {
  "use cache: private"
  cacheLife("minutes")
  cacheTag("user-sessions")

  const h = await headers()
  return auth.api.listSessions({ headers: h })
})

"use server"

import { eq } from "drizzle-orm"
import { cacheLife, cacheTag } from "next/cache"
import { redirect } from "next/navigation"
import { cache } from "react"
import { authAction, publicAction } from "@/core/dal"
import { db } from "@/db"
import { users } from "@/modules/auth/schema"
import { getServerSession } from "../auth/server"
import { userSettings } from "./schema"

export async function gerCurrentUser() {
  const session = await getServerSession()

  if (!session) {
    redirect("/sign-in")
  }

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  if (!currentUser) {
    redirect("/sign-in")
  }

  return currentUser
}

export async function getUserSettings() {
  return await authAction(async (user) => {
    return await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, user.id))
  })
}

export async function updatePublicUserSettings(isPrivate: boolean) {
  return await authAction(async (user) => {
    return await db
      .update(userSettings)
      .set({ privateAccount: isPrivate })
      .where(eq(userSettings.userId, user.id))
      .returning()
  })
}

export const getUserByUsername = cache(
  async <const T extends { [K in keyof typeof users.$inferSelect]?: boolean }>(
    username: string,
    columns?: T,
  ) => {
    "use cache"
    cacheTag(`users:${username}`)
    cacheLife("minutes")

    return await publicAction(() =>
      db.query.users.findFirst({
        columns,
        where: eq(users.username, username.toLowerCase()),
      }),
    )
  },
)

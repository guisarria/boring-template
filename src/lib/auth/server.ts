"use server"

import { cacheLife } from "next/cache"
import { headers } from "next/headers"
import { cache } from "react"
import { auth } from "./auth"

const getServerSession = cache(async () => {
  "use cache: private"
  cacheLife("hours")

  const h = await headers()
  return auth.api.getSession({ headers: h })
})

export const serverSession = getServerSession

export const getCurrentUser = cache(async () => {
  "use cache: private"
  cacheLife("hours")

  const session = await getServerSession()
  return session?.user
})

export const getServerAction = cache(async () => {
  "use cache: private"
  cacheLife("hours")

  const session = await getServerSession()
  return session?.session
})

export const serverActiveSessions = cache(async () => {
  "use cache: private"
  cacheLife("hours")

  const h = await headers()
  return auth.api.listSessions({ headers: h })
})

"use server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import { auth } from "./auth"

export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  return session
})

export const getServerSignOut = cache(async () => {
  const signOut = await auth.api.signOut({ headers: await headers() })
  if (signOut.success) {
    redirect("/")
  }

  return signOut
})

export const getServerAction = cache(async () => {
  const session = await getServerSession()
  return session?.session
})

export const getCurrentUser = cache(async () => {
  const session = await getServerSession()
  return session?.user
})

export const getServerActiveSessions = cache(async () => {
  const session = await auth.api.listSessions({ headers: await headers() })
  return session
})

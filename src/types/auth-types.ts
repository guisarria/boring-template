import type { auth } from "../lib/auth/auth"

export type User = typeof auth.$Infer.Session.user
export type Session = typeof auth.$Infer.Session
export type ActiveSessions = (typeof auth.$Infer.Session.session)[]

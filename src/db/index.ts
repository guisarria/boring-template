import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { env } from "@/core/env/server"
import {
  accounts,
  accountsRelations,
  sessions,
  sessionsRelations,
  users,
  usersRelations,
  verifications,
} from "@/modules/auth/schema"
import { bookRelations, books } from "@/modules/books/schema"
import { pageRelations, pages } from "@/modules/pages/schema"
import { userSettings, userSettingsRelations } from "@/modules/users/schema"

export const schema = {
  users,
  usersRelations,
  accounts,
  accountsRelations,
  sessions,
  sessionsRelations,
  verifications,
  books,
  bookRelations,
  pages,
  pageRelations,
  userSettings,
  userSettingsRelations,
}

const sql = neon(env.DATABASE_URL)

export const db = drizzle({
  client: sql,
  schema,
  casing: "snake_case",
})

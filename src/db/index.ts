import { drizzle } from "drizzle-orm/neon-http"
import { env } from "@/lib/env"
import { schema } from "./schemas"

export const db = drizzle(env.DATABASE_URL, {
  schema,
  casing: "snake_case"
})

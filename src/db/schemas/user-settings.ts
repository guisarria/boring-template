import { relations } from "drizzle-orm"
import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { users } from "./users"

export const userSettings = pgTable("user_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  theme: text("theme").default("system").notNull(),
  language: text("language").default("en").notNull(),
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  privateAccount: boolean("private_account").default(false).notNull(),
  metadata: jsonb("metadata"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
})

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id]
  })
}))

import { relations, sql } from "drizzle-orm"
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import z from "zod"
import { type Page, pages } from "./pages"
import { users } from "./users"

export const books = pgTable(
  "books",
  {
    id: text("id").primaryKey().default(sql`uuid_generate_v7()`),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isPublic: boolean("is_public").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  (table) => [index("books_userId_idx").on(table.userId)]
)

export const bookRelations = relations(books, ({ many, one }) => ({
  pages: many(pages),
  user: one(users, {
    fields: [books.userId],
    references: [users.id]
  })
}))

export type BookWithPages = typeof books.$inferSelect & {
  pages: Page[]
}

export type Book = typeof books.$inferSelect

export type InsertBook = typeof books.$inferInsert

export const createBookSchema = z.object({
  name: z.string().min(1).max(50),
  isPublic: z.boolean()
})

export const updateBookSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  isPublic: z.boolean().optional()
})

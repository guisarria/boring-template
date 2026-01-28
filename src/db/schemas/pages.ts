import { relations, sql } from "drizzle-orm"
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core"
import z from "zod"
import { books } from "./books"

export const pages = pgTable(
  "pages",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    content: jsonb("content").notNull(),
    bookId: text("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    isPublic: boolean("is_public").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  (table) => [
    uniqueIndex("page_bookId_title_idx").on(table.bookId, table.title)
  ]
)

export const pageRelations = relations(pages, ({ one }) => ({
  book: one(books, {
    fields: [pages.bookId],
    references: [books.id]
  })
}))

export type Page = typeof pages.$inferSelect
export type InsertPage = typeof pages.$inferInsert

export const createPageSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.record(z.string(), z.unknown()).refine(
    (value) => {
      try {
        JSON.stringify(value)
        return true
      } catch {
        return false
      }
    },
    {
      message: "Content must be valid JSON"
    }
  ),
  isPublic: z.boolean()
})

export const updatePageSchema = createPageSchema.partial()

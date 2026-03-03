import type { JSONContent } from "@tiptap/core"
import { relations, sql } from "drizzle-orm"
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import z from "zod"
import { books } from "@/modules/books/schema"

export const pages = pgTable(
  "pages",
  {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    content: jsonb("content").$type<JSONContent>().notNull(),
    bookId: text("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    isPublic: boolean("is_public").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("page_bookId_title_idx").on(table.bookId, table.title),
    index("pages_bookId_idx").on(table.bookId),
  ],
)

export const pageRelations = relations(pages, ({ one }) => ({
  book: one(books, {
    fields: [pages.bookId],
    references: [books.id],
  }),
}))

export type Page = typeof pages.$inferSelect
export type InsertPage = typeof pages.$inferInsert

export const contentSchema = z.custom<JSONContent>(
  (value) =>
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as Record<string, unknown>).type === "doc",
  { message: "Content must be a valid document with type 'doc'" },
)

export const emptyContent: JSONContent = { type: "doc", content: [] }

export const createPageSchema = z.object({
  title: z.string().min(1).max(100),
  content: contentSchema,
  isPublic: z.boolean(),
})

export const updatePageSchema = createPageSchema.partial()

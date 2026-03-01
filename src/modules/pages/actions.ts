"use server"

import { eq } from "drizzle-orm"
import { cache } from "react"
import { ownedAction, publicAction } from "@/core/dal"
import { db } from "@/db"
import { books } from "@/modules/books/schema"
import {
  contentSchema,
  createPageSchema,
  type InsertPage,
  type Page,
  pages,
  updatePageSchema,
} from "./schema"

export async function createPage(values: InsertPage) {
  return await ownedAction({
    fetch: async () =>
      await db.query.books.findFirst({ where: eq(books.id, values.bookId) }),
    ownerId: (book) => book.userId,
    action: async () => {
      const parsed = createPageSchema.parse(values)
      return await db
        .insert(pages)
        .values({ ...parsed, bookId: values.bookId })
        .returning({ id: pages.id })
    },
    invalidate: [`books:${values.bookId}`],
  })
}

export const getPageById = cache(
  async <const T extends { [K in keyof Page]?: boolean }>(
    id: string,
    columns: T,
  ) => {
    return await publicAction(async () => {
      const page = await db.query.pages.findFirst({
        where: eq(pages.id, id),
        columns,
        with: { book: true },
      })

      return { page }
    })
  },
)

export async function updatePage(id: string, values: Partial<InsertPage>) {
  return await ownedAction({
    fetch: () =>
      db.query.pages.findFirst({
        where: eq(pages.id, id),
        with: { book: true },
      }),
    ownerId: (record) => record.book.userId,
    action: async () => {
      const parsed = updatePageSchema.parse(values)
      await db.update(pages).set(parsed).where(eq(pages.id, id))
    },
    invalidate: (_, resource) => [`books:${resource.book.id}`, `pages:${id}`],
  })
}

export async function updatePageContent(id: string, content: unknown) {
  return await ownedAction({
    fetch: () =>
      db.query.pages.findFirst({
        where: eq(pages.id, id),
        with: { book: true },
      }),
    ownerId: (record) => record.book.userId,
    action: async () => {
      const parsed = contentSchema.parse(content)
      await db.update(pages).set({ content: parsed }).where(eq(pages.id, id))
    },
    invalidate: [`pages:${id}`],
  })
}

export async function deletePage(id: string) {
  return await ownedAction({
    fetch: () =>
      db.query.pages.findFirst({
        where: eq(pages.id, id),
        with: { book: true },
      }),
    ownerId: (page) => page.book.userId,
    action: async () =>
      await db
        .delete(pages)
        .where(eq(pages.id, id))
        .returning({ id: pages.id }),
    invalidate: [`pages:${id}`],
  })
}

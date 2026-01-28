"use server"

import { eq } from "drizzle-orm"
import { cacheLife, cacheTag, updateTag } from "next/cache"
import { cache } from "react"
import { db } from "@/db"
import { books } from "@/db/schemas/books"
import { type InsertPage, type Page, pages } from "@/db/schemas/pages"
import { runDbOperation, serialize, withOwnership } from "@/lib/dal/helpers"

export async function createPage(values: InsertPage) {
  const result = withOwnership(
    async () =>
      await db.query.books.findFirst({ where: eq(books.id, values.bookId) }),
    (book) => book.userId,
    async () => {
      return await db.insert(pages).values(values).returning({ id: pages.id })
    }
  )

  const resolved = await result
  if (resolved.isOk()) {
    updateTag(`books:${values.bookId}`)
  }

  return serialize(result)
}

export const getPageById = cache(
  async <const T extends { [K in keyof Page]?: boolean }>(
    id: string,
    columns: T
  ) => {
    "use cache: private"

    cacheTag(`pages:${id}`)
    cacheLife("minutes")

    const result = runDbOperation(async () => {
      const page = await db.query.pages.findFirst({
        where: eq(pages.id, id),
        columns,
        with: { book: true }
      })

      return { page }
    })

    return serialize(result)
  }
)

export async function updatePage(id: string, values: Partial<InsertPage>) {
  const result = withOwnership(
    () =>
      db.query.pages.findFirst({
        where: eq(pages.id, id),
        with: { book: true }
      }),
    (record) => record.book.userId,
    async (record) => {
      await db.update(pages).set(values).where(eq(pages.id, id))
      updateTag(`books:${record.book.id}`)
      updateTag(`pages:${id}`)
    }
  )

  return serialize(result)
}

export async function updatePageContent(id: string, content: unknown) {
  const result = withOwnership(
    () =>
      db.query.pages.findFirst({
        where: eq(pages.id, id),
        with: { book: true }
      }),
    (record) => record.book.userId,
    async () => {
      await db.update(pages).set({ content }).where(eq(pages.id, id))
      updateTag(`pages:${id}`)
    }
  )

  return serialize(result)
}

export async function deletePage(id: string) {
  const result = withOwnership(
    () =>
      db.query.pages.findFirst({
        where: eq(pages.id, id),
        with: { book: true }
      }),
    (page) => page.book.userId,
    async () => {
      return await db
        .delete(pages)
        .where(eq(pages.id, id))
        .returning({ id: pages.id })
    }
  )

  const resolved = await result
  if (resolved.isOk()) {
    updateTag(`pages:${id}`)
  }

  return serialize(result)
}

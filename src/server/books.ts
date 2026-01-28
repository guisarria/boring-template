"use server"

import { and, eq } from "drizzle-orm"
import { cacheLife, cacheTag, updateTag } from "next/cache"
import { cache } from "react"
import { db } from "@/db"
import { type Book, books, type InsertBook } from "@/db/schemas/books"
import {
  runDbOperation,
  serialize,
  withAuth,
  withOwnership
} from "@/lib/dal/helpers"

export async function createBook(values: Omit<InsertBook, "userId">) {
  const result = withAuth(async (user) => {
    return await db
      .insert(books)
      .values({ ...values, userId: user.id })
      .returning({ id: books.id })
  })

  const resolved = await result
  if (resolved.isOk()) {
    const inserted = resolved.value[0]
    if (inserted) {
      updateTag(`books:${inserted.id}`)
    }
  }

  return serialize(result)
}

export const getUserBooks = cache(
  async <T extends Partial<Record<keyof Book, boolean>>>(data: {
    columns: T
  }) => {
    "use cache: private"

    cacheTag("books")
    cacheLife("minutes")

    const result = withAuth(
      async (user) =>
        await db.query.books.findMany({
          columns: data.columns,
          where: eq(books.userId, user.id),
          with: { pages: true }
        })
    )

    return serialize(result)
  }
)

export const getPublicBooksByUserId = cache(
  async <T extends Partial<Record<keyof Book, boolean>>>(data: {
    userId: string
    columns: T
  }) => {
    "use cache: private"

    cacheTag(`public-books:${data.userId}`)
    cacheLife("minutes")

    const result = runDbOperation(() =>
      db.query.books.findMany({
        columns: data.columns,
        where: and(eq(books.userId, data.userId), eq(books.isPublic, true)),
        with: {
          pages: true
        }
      })
    )

    return serialize(result)
  }
)

export const getBookById = cache(
  async <T extends Partial<Record<keyof Book, boolean>>>(data: {
    id: string
    columns: T
  }) => {
    "use cache: private"

    cacheTag(`books:${data.id}`)
    cacheLife("minutes")

    const result = runDbOperation(() =>
      db.query.books.findFirst({
        columns: data.columns,
        where: eq(books.id, data.id),
        with: {
          pages: true
        }
      })
    )

    return serialize(result)
  }
)

export async function updateBookById(data: {
  id: string
  values: Omit<InsertBook, "userId" | "id">
}) {
  const result = withOwnership(
    () => db.query.books.findFirst({ where: eq(books.id, data.id) }),
    (book) => book.userId,
    async () => {
      await db.update(books).set(data.values).where(eq(books.id, data.id))
    }
  )

  const resolved = await result
  if (resolved.isOk()) {
    updateTag(`books:${data.id}`)
  }

  return serialize(result)
}

export async function deleteBookById(data: { id: string }) {
  const result = withOwnership(
    () => db.query.books.findFirst({ where: eq(books.id, data.id) }),
    (book) => book.userId,
    async () => {
      await db.delete(books).where(eq(books.id, data.id))
    }
  )

  const resolved = await result
  if (resolved.isOk()) {
    updateTag(`books:${data.id}`)
  }

  return serialize(result)
}

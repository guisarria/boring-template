"use server"

import { and, eq } from "drizzle-orm"
import { cacheLife, cacheTag } from "next/cache"
import { cache } from "react"
import { authAction, ownedAction, publicAction } from "@/core/dal"
import { db } from "@/db"
import {
  type Book,
  books,
  createBookSchema,
  type InsertBook,
  updateBookSchema,
} from "./schema"

export async function createBook(values: InsertBook) {
  return await authAction(
    async (user) => {
      const parsed = createBookSchema.parse(values)
      return await db
        .insert(books)
        .values({ ...parsed, userId: user.id })
        .returning({ id: books.id })
    },
    { invalidate: (data) => [`books:${data[0]?.id}`] },
  )
}

export const getUserBooks = cache(
  async <T extends Partial<Record<keyof Book, boolean>>>(data: {
    columns: T
  }) => {
    "use cache: private"

    cacheTag("books")
    cacheLife("minutes")

    return await authAction(
      async (user) =>
        await db.query.books.findMany({
          columns: data.columns,
          where: eq(books.userId, user.id),
          with: { pages: { columns: { id: true, title: true } } },
        }),
    )
  },
)

export const getPublicBooksByUserId = cache(
  async <T extends Partial<Record<keyof Book, boolean>>>(data: {
    userId: string
    columns: T
  }) => {
    "use cache: private"

    cacheTag(`public-books:${data.userId}`)
    cacheLife("minutes")

    return await publicAction(() =>
      db.query.books.findMany({
        columns: data.columns,
        where: and(eq(books.userId, data.userId), eq(books.isPublic, true)),
        with: { pages: { columns: { id: true } } },
      }),
    )
  },
)

export const getBookById = cache(
  async <T extends Partial<Record<keyof Book, boolean>>>(data: {
    id: string
    columns: T
  }) => {
    "use cache: private"

    cacheTag(`books:${data.id}`)
    cacheLife("minutes")

    return await publicAction(() =>
      db.query.books.findFirst({
        columns: data.columns,
        where: eq(books.id, data.id),
        with: { pages: true },
      }),
    )
  },
)

export async function updateBookById(data: {
  id: string
  values: Omit<InsertBook, "userId" | "id">
}) {
  return await ownedAction({
    fetch: () => db.query.books.findFirst({ where: eq(books.id, data.id) }),
    ownerId: (book) => book.userId,
    action: async () => {
      const parsed = updateBookSchema.parse(data.values)
      await db.update(books).set(parsed).where(eq(books.id, data.id))
    },
    invalidate: [`books:${data.id}`],
  })
}

export async function deleteBookById(data: { id: string }) {
  return await ownedAction({
    fetch: () => db.query.books.findFirst({ where: eq(books.id, data.id) }),
    ownerId: (book) => book.userId,
    action: async () => {
      await db.delete(books).where(eq(books.id, data.id))
    },
    invalidate: [`books:${data.id}`],
  })
}

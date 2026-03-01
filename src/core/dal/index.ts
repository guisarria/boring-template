import { DrizzleQueryError } from "drizzle-orm"
import { errAsync, fromPromise, okAsync, type ResultAsync } from "neverthrow"
import { updateTag } from "next/cache"
import { notFound, redirect } from "next/navigation"
import { ZodError } from "zod"
import { getServerSession } from "@/modules/auth/server"
import type { User } from "@/modules/auth/types"

export type AppError =
  | { type: "unauthenticated" }
  | { type: "unauthorized" }
  | { type: "not-found"; entity: string }
  | { type: "persistence"; error: DrizzleQueryError }
  | { type: "unexpected"; error: unknown }
  | { type: "validation"; message: string }

export const appErrors = {
  unauthenticated: (): AppError => ({ type: "unauthenticated" }),
  unauthorized: (): AppError => ({ type: "unauthorized" }),
  notFound: (entity: string): AppError => ({ type: "not-found", entity }),
  persistence: (error: DrizzleQueryError): AppError => ({
    type: "persistence",
    error,
  }),
  unexpected: (error: unknown): AppError => ({ type: "unexpected", error }),
  validation: (message: string): AppError => ({ type: "validation", message }),
} as const

export type SerializedResult<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E }

export function handleError(error: AppError): never {
  if (error.type === "unauthenticated") {
    redirect("/sign-in")
  }
  if (error.type === "unauthorized") {
    redirect("/dashboard")
  }
  if (error.type === "not-found") {
    notFound()
  }
  throw error
}

export function assertSuccess<T>(
  result: SerializedResult<T>,
): asserts result is { success: true; data: T } {
  if (!result.success) {
    handleError(result.error)
  }
}

function toAppError(e: unknown): AppError {
  if (e instanceof ZodError) {
    return appErrors.validation(e.issues[0]?.message ?? "Validation error")
  }
  if (e instanceof DrizzleQueryError) {
    return appErrors.persistence(e)
  }
  if (e instanceof Error && e.name === "ValidationError") {
    return appErrors.validation(e.message)
  }
  return appErrors.unexpected(e)
}

function runDbOp<T>(operation: () => Promise<T>): ResultAsync<T, AppError> {
  return fromPromise(operation(), toAppError)
}

function getAuthUser(): ResultAsync<User, AppError> {
  return fromPromise(getServerSession(), appErrors.unexpected).andThen(
    (session) =>
      session?.user
        ? okAsync(session.user)
        : errAsync(appErrors.unauthenticated()),
  )
}

async function toResult<T>(
  result: ResultAsync<T, AppError>,
): Promise<SerializedResult<T>> {
  return await result.match(
    (data) => ({ success: true as const, data }),
    (error) => ({ success: false as const, error }),
  )
}

function invalidateTags(tags: string[]) {
  for (const tag of tags) {
    updateTag(tag)
  }
}

export async function publicAction<T>(
  action: () => Promise<T>,
): Promise<SerializedResult<T>> {
  return await toResult(runDbOp(action))
}

export async function authAction<T>(
  action: (user: User) => Promise<T>,
  options?: { invalidate?: string[] | ((data: T) => string[]) },
): Promise<SerializedResult<T>> {
  const result = getAuthUser().andThen((user) =>
    runDbOp(() => action(user)).andThen((data) => {
      if (options?.invalidate) {
        const tags =
          typeof options.invalidate === "function"
            ? options.invalidate(data)
            : options.invalidate
        invalidateTags(tags)
      }
      return okAsync(data)
    }),
  )

  return await toResult(result)
}

export async function ownedAction<TResource, TResult>(options: {
  fetch: () => Promise<TResource | null | undefined>
  ownerId: (resource: TResource) => string
  action: (resource: TResource, user: User) => Promise<TResult>
  entity?: string
  invalidate?: string[] | ((data: TResult, resource: TResource) => string[])
}): Promise<SerializedResult<TResult>> {
  const { entity = "resource" } = options

  const result = getAuthUser().andThen((user) =>
    runDbOp(options.fetch).andThen((resource) => {
      if (!resource) {
        return errAsync(appErrors.notFound(entity))
      }
      if (options.ownerId(resource) !== user.id) {
        return errAsync(appErrors.unauthorized())
      }

      return runDbOp(() => options.action(resource, user)).andThen((data) => {
        if (options.invalidate) {
          const tags =
            typeof options.invalidate === "function"
              ? options.invalidate(data, resource)
              : options.invalidate
          invalidateTags(tags)
        }
        return okAsync(data)
      })
    }),
  )

  return await toResult(result)
}

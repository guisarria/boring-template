import { DrizzleQueryError } from "drizzle-orm"
import { errAsync, fromPromise, okAsync, type ResultAsync } from "neverthrow"
import { notFound, redirect } from "next/navigation"
import type { users } from "@/db/schemas/users"
import { serverSession } from "../auth/server"

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
    error
  }),
  unexpected: (error: unknown): AppError => ({ type: "unexpected", error }),
  validation: (message: string): AppError => ({ type: "validation", message })
} as const

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

export type SerializedResult<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E }

export async function serialize<T, E = AppError>(
  result: ResultAsync<T, E>
): Promise<SerializedResult<T, E>> {
  return result.match(
    (data) => ({ success: true as const, data }),
    (error) => ({ success: false as const, error })
  )
}

type AuthUser = typeof users.$inferSelect

export function getAuthUser(): ResultAsync<AuthUser, AppError> {
  return fromPromise(serverSession(), appErrors.unexpected).andThen(
    (session) => {
      if (!session?.user) {
        return errAsync(appErrors.unauthenticated())
      }

      const normalizedUser: AuthUser = {
        ...session.user,
        image: session.user.image ?? null,
        username: session.user.username ?? null,
        displayUsername: session.user.displayUsername ?? null
      }

      return okAsync(normalizedUser)
    }
  )
}

export function runDbOperation<T>(
  operation: () => Promise<T>
): ResultAsync<T, AppError> {
  return fromPromise(operation(), (e) => {
    if (e instanceof DrizzleQueryError) {
      return appErrors.persistence(e)
    }
    if (e instanceof Error && e.name === "ValidationError") {
      return appErrors.validation(e.message)
    }
    return appErrors.unexpected(e)
  })
}

export function withAuth<T>(
  operation: (user: AuthUser) => Promise<T>
): ResultAsync<T, AppError> {
  return getAuthUser().andThen((user) => runDbOperation(() => operation(user)))
}

export function fetchOwned<TResource>(
  fetch: () => Promise<TResource | null | undefined>,
  getOwnerId: (resource: TResource) => string,
  entityType = "resource"
): ResultAsync<{ resource: TResource; user: AuthUser }, AppError> {
  return getAuthUser().andThen((user) =>
    runDbOperation(fetch).andThen((resource) => {
      if (!resource) {
        return errAsync(appErrors.notFound(entityType))
      }

      if (getOwnerId(resource) !== user.id) {
        return errAsync(appErrors.unauthorized())
      }

      return okAsync({ resource, user })
    })
  )
}

export function withOwnership<TResource, TResult>(
  fetch: () => Promise<TResource | null | undefined>,
  getOwnerId: (resource: TResource) => string,
  action: (resource: TResource, user: AuthUser) => Promise<TResult>,
  entityType = "resource"
): ResultAsync<TResult, AppError> {
  return fetchOwned(fetch, getOwnerId, entityType).andThen(
    ({ resource, user }) => runDbOperation(() => action(resource, user))
  )
}

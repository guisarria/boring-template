import { DrizzleQueryError } from "drizzle-orm"
import { errAsync, fromPromise, okAsync, type ResultAsync } from "neverthrow"
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

type AppResult<T> = ResultAsync<T, AppError>
type AsyncOperation<T> = () => Promise<T>

const APP_ERROR_TYPES: readonly AppError["type"][] = [
  "unauthenticated",
  "unauthorized",
  "not-found",
  "persistence",
  "unexpected",
  "validation",
]

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

export type SerializedResult<T, E extends AppError = AppError> =
  | { success: true; data: T }
  | { success: false; error: E }

export function handleError(error: AppError): never {
  switch (error.type) {
    case "unauthenticated":
      return redirect("/sign-in")
    case "unauthorized":
      return redirect("/dashboard")
    case "not-found":
      return notFound()
    default:
      throw error
  }
}

export function assertSuccess<T>(
  result: SerializedResult<T>,
): asserts result is { success: true; data: T } {
  if (!result.success) {
    handleError(result.error)
  }
}

function isAppError(error: unknown): error is AppError {
  if (typeof error !== "object" || error === null || !("type" in error)) {
    return false
  }

  const type = (error as { type: unknown }).type
  return APP_ERROR_TYPES.includes(type as AppError["type"])
}

function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error
  }
  if (error instanceof ZodError) {
    return appErrors.validation(error.issues[0]?.message ?? "Validation error")
  }
  if (error instanceof DrizzleQueryError) {
    return appErrors.persistence(error)
  }
  if (error instanceof Error && error.name === "ValidationError") {
    return appErrors.validation(error.message)
  }
  return appErrors.unexpected(error)
}

function runSafe<T>(operation: AsyncOperation<T>): AppResult<T> {
  return fromPromise(operation(), toAppError)
}

function getAuthUser(): AppResult<User> {
  return runSafe(getServerSession).andThen((session) =>
    session?.user
      ? okAsync(session.user)
      : errAsync(appErrors.unauthenticated()),
  )
}

async function toSerializedResult<T>(
  result: AppResult<T>,
): Promise<SerializedResult<T>> {
  return await result.match(
    (data) => ({ success: true as const, data }),
    (error) => ({ success: false as const, error }),
  )
}

function ensureOwnedResource<TResource>(options: {
  resource: TResource | null | undefined
  ownerId: (resource: TResource) => string
  userId: string
  entity: string
}): AppResult<TResource> {
  const { resource, ownerId, userId, entity } = options

  if (!resource) {
    return errAsync(appErrors.notFound(entity))
  }

  if (ownerId(resource) !== userId) {
    return errAsync(appErrors.unauthorized())
  }

  return okAsync(resource)
}

export async function publicAction<T>(
  action: AsyncOperation<T>,
): Promise<SerializedResult<T>> {
  return await toSerializedResult(runSafe(action))
}

export async function authAction<T>(
  action: (user: User) => Promise<T>,
): Promise<SerializedResult<T>> {
  const result = getAuthUser().andThen((user) => runSafe(() => action(user)))

  return await toSerializedResult(result)
}

export async function ownedAction<TResource, TResult>(options: {
  fetch: AsyncOperation<TResource | null | undefined>
  ownerId: (resource: TResource) => string
  action: (resource: TResource, user: User) => Promise<TResult>
  entity?: string
}): Promise<SerializedResult<TResult>> {
  const { entity = "resource" } = options

  const result = getAuthUser().andThen((user) =>
    runSafe(options.fetch).andThen((resource) =>
      ensureOwnedResource({
        resource,
        ownerId: options.ownerId,
        userId: user.id,
        entity,
      }).andThen((ownedResource) =>
        runSafe(() => options.action(ownedResource, user)),
      ),
    ),
  )

  return await toSerializedResult(result)
}

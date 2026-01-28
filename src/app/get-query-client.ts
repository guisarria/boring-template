import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient
} from "@tanstack/react-query"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60 * 24
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        shouldRedactErrors: () => false
      }
    }
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient() // Always new on server
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient() // Singleton on client
  }
  return browserQueryClient
}

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { assertSuccess } from "@/core/dal"
import { getUserBooks } from "@/modules/books/actions"
import { BookCard } from "./book-card"

export const BooksCardGrid = async () => {
  const result = await getUserBooks({
    columns: {
      id: true,
      userId: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      isPublic: true,
    },
  })

  assertSuccess(result)

  const books = result.data

  return (
    <div className="mx-auto flex w-full flex-wrap gap-8">
      {books?.map((book) => (
        <BookCard book={book} key={book.id} />
      ))}

      {books?.length === 0 && (
        <div>
          <p>No books found</p>
        </div>
      )}
    </div>
  )
}

function BookCardSkeleton() {
  return (
    <Card className="w-3xs">
      <CardHeader className="flex items-center justify-between py-1">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-20 rounded-md" />
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-x-2 pb-5">
        <Skeleton className="h-6 w-14 rounded-md" />
        <Skeleton className="size-6 rounded-md" />
        <Skeleton className="size-6 rounded-md" />
      </CardFooter>
    </Card>
  )
}

export function BooksCardGridSkeleton() {
  return (
    <div className="mx-auto flex w-full flex-wrap gap-8">
      <BookCardSkeleton />
      <BookCardSkeleton />
      <BookCardSkeleton />
      <BookCardSkeleton />
    </div>
  )
}

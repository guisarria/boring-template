import { GlobeIcon, LockIcon, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { Activity, Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Book } from "@/modules/books/schema"
import { DeleteBookDialog } from "./delete-book-dialog"
import { EditBookDialog } from "./edit-book-dialog"

type BookCardProps = {
  book: Pick<Book, "id" | "name" | "isPublic"> & {
    pages: { id: string; title: string }[]
  }
  isPublic?: boolean
  className?: string
}

export function BookCard({ book, className }: BookCardProps) {
  const pagesCount = book.pages?.length ?? 0
  const pageLabel = pagesCount === 1 ? "page" : "pages"

  return (
    <Card className={cn("w-3xs", className)}>
      <CardHeader className="flex items-center justify-between">
        <Suspense fallback={<Skeleton className="h-5 w-16 rounded-full" />}>
          <CardTitle className="truncate text-xl">{book.name}</CardTitle>
        </Suspense>
        <Suspense fallback={<Skeleton className="h-5 w-16 rounded-full" />}>
          <Activity mode={book.isPublic ? "visible" : "hidden"}>
            <Badge variant={"outline"}>
              <GlobeIcon
                absoluteStrokeWidth
                className="text-cyan-300"
                data-icon="inline-start"
              />
              Public
            </Badge>
          </Activity>

          <Activity mode={book.isPublic ? "hidden" : "visible"}>
            <Badge variant={"outline"}>
              <LockIcon
                absoluteStrokeWidth
                className="text-orange-400"
                data-icon="inline-start"
              />
              Private
            </Badge>
          </Activity>
        </Suspense>
      </CardHeader>
      <Suspense fallback={<Skeleton className="h-5 w-16 rounded-full" />}>
        <CardContent className="text-muted-foreground text-sm">
          <p>
            {pagesCount} {pageLabel}
          </p>
        </CardContent>
      </Suspense>
      <CardFooter className="flex items-center justify-end gap-x-2">
        <Suspense
          fallback={
            <Button disabled size="sm" variant="outline">
              <Link href={`/dashboard/book/${book.id}`} prefetch>
                View
              </Link>
            </Button>
          }
        >
          <Button
            nativeButton={false}
            render={
              <Link href={`/dashboard/book/${book.id}`} prefetch>
                View
              </Link>
            }
            size="sm"
            variant="outline"
          />
        </Suspense>
        <Suspense
          fallback={
            <Button disabled size="icon-sm" variant="outline">
              <Pencil />
            </Button>
          }
        >
          <EditBookDialog
            bookId={book.id}
            bookIsPublic={book.isPublic}
            bookName={book.name}
          />
        </Suspense>

        <Suspense
          fallback={
            <Button disabled size="icon-sm" variant="destructive-outline">
              <Trash2 />
            </Button>
          }
        >
          <DeleteBookDialog
            bookId={book.id}
            bookName={book.name}
            pagesCount={pagesCount}
          />
        </Suspense>
      </CardFooter>
    </Card>
  )
}

import { GlobeIcon, LockIcon, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { lazy, Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Book } from "@/modules/books/schema"

const EditBookDialog = lazy(() =>
  import("./edit-book-dialog").then((mod) => ({
    default: mod.EditBookDialog,
  })),
)

const DeleteBookDialog = lazy(() =>
  import("./delete-book-dialog").then((mod) => ({
    default: mod.DeleteBookDialog,
  })),
)

type BookCardProps = {
  book: Book & { pages: { id: string; title: string }[] }
  isPublic?: boolean
  className?: string
}

export function BookCard({ book, isPublic, className }: BookCardProps) {
  const pagesCount = book.pages?.length ?? 0
  const pageLabel = pagesCount === 1 ? "page" : "pages"

  return (
    <Card className={cn("w-3xs", className)}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="truncate text-xl">{book.name}</CardTitle>
        {book.isPublic ? (
          <Badge variant={"outline"}>
            <GlobeIcon
              absoluteStrokeWidth
              className="text-cyan-300"
              data-icon="inline-start"
            />
            Public
          </Badge>
        ) : (
          <Badge variant={"outline"}>
            <LockIcon
              absoluteStrokeWidth
              className="text-orange-400"
              data-icon="inline-start"
            />
            Private
          </Badge>
        )}
      </CardHeader>

      <CardContent className="text-muted-foreground text-sm">
        <p>
          {pagesCount} {pageLabel}
        </p>
      </CardContent>
      {!isPublic && (
        <CardFooter className="flex items-center justify-end gap-x-2">
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
      )}
    </Card>
  )
}

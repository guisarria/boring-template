"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { deleteBookById } from "@/modules/books/actions"

type DeleteBookDialogProps = {
  bookId: string
  bookName: string
  pagesCount: number
}

export function DeleteBookDialog({
  bookId,
  bookName,
  pagesCount,
}: DeleteBookDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const pageLabel = pagesCount === 1 ? "page" : "pages"

  const handleDeleteBookById = (data: { id: string }) => {
    startTransition(async () => {
      const result = await deleteBookById(data)
      if (result.success) {
        toast.success("Book deleted successfully")
        router.refresh()
        setIsOpen(false)
      } else {
        toast.error("Failed to delete book")
      }
    })
  }

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger
        render={
          <Button
            aria-label="Delete book"
            size="icon-sm"
            variant="destructive-outline"
          >
            <Trash2 />
          </Button>
        }
      />
      <AlertDialogContent className="dark:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            <span className="max-w-xs text-ellipsis">Delete {bookName}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {bookName}
            {pagesCount !== 0 ? ` and its ${pagesCount} ${pageLabel}.` : "."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            disabled={isPending}
            onClick={() => handleDeleteBookById({ id: bookId })}
            variant="destructive"
          >
            <LoadingSwap isLoading={isPending}>Delete</LoadingSwap>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

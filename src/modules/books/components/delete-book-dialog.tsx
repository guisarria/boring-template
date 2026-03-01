"use client"

import { useMutation } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useState } from "react"
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
  onSuccessAction?: () => void
}

export function DeleteBookDialog({
  bookId,
  bookName,
  pagesCount,
  onSuccessAction,
}: DeleteBookDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pageLabel = pagesCount === 1 ? "page" : "pages"

  const { isPending, mutateAsync: handleDeleteBookById } = useMutation({
    mutationFn: async (data: { id: string }) => await deleteBookById(data),
    mutationKey: ["book", bookId],
    onSuccess: () => {
      toast.success("Book deleted successfully")
      onSuccessAction?.()
      setIsOpen(false)
    },
    onError: () => {
      toast.error("Failed to delete book")
    },
  })

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger
        render={
          <Button size="icon-sm" variant="destructive-outline">
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
            <LoadingSwap isLoading={isPending}>{"Continue"}</LoadingSwap>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

"use client"

import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { GlobeIcon, LockIcon, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import type { z } from "zod"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { type BookWithPages, createBookSchema } from "@/db/schemas/books"
import { cn } from "@/lib/utils"
import { deleteBookById, updateBookById } from "@/server/books"

type BookCardProps = {
  book: Pick<BookWithPages, "id" | "userId" | "isPublic" | "pages" | "name">
  isPublic?: boolean
  className?: string
}

export default function BookCard({ book, isPublic, className }: BookCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      name: book.name,
      isPublic: book.isPublic
    },
    validators: {
      onChangeAsync: createBookSchema
    },
    onSubmit: async ({
      value
    }: {
      value: z.infer<typeof createBookSchema>
    }) => {
      const response = await updateBookById({
        id: book.id,
        values: value
      })
      if (!response.success) {
        toast.error("Failed to update book")
        return
      }
      toast.success("Book updated successfully")
      queryClient.invalidateQueries({ queryKey: ["user-books"] })
      setIsEditing(false)
    }
  })

  const { isPending, mutateAsync: handleDeleteBookById } = useMutation({
    mutationFn: async (data: { id: string }) => await deleteBookById(data),
    mutationKey: ["book", book.id],
    onSuccess: () => {
      toast.success("Book deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["user-books"] })
      setIsOpen(!isOpen)
    },
    onError: () => {
      toast.error("Failed to delete book")
    }
  })

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

          <Dialog onOpenChange={setIsEditing} open={isEditing}>
            <DialogTrigger
              render={
                <Button size="icon-sm" variant="outline">
                  <Pencil />
                </Button>
              }
            />
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Edit book</DialogTitle>
                <DialogDescription>
                  Update your book configuration.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  form.handleSubmit()
                }}
              >
                <FieldSet>
                  <FieldGroup>
                    <form.Field name="name">
                      {(field) => {
                        const isInvalid =
                          !!field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel
                              aria-invalid={isInvalid}
                              htmlFor={field.name}
                            >
                              Name
                            </FieldLabel>
                            <Input
                              aria-invalid={isInvalid}
                              autoComplete="off"
                              id={field.name}
                              name={field.name}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Book name"
                              value={field.state.value}
                            />
                            {!!isInvalid && <FieldError className="text-xs" />}
                          </Field>
                        )
                      }}
                    </form.Field>

                    <form.Field name="isPublic">
                      {(field) => {
                        const isInvalid =
                          !!field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <Label className="flex items-start gap-2 rounded-lg border p-2 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                              <Checkbox
                                aria-invalid={isInvalid}
                                checked={field.state.value}
                                id={field.name}
                                onCheckedChange={(checked) =>
                                  field.handleChange(!!checked)
                                }
                              />
                              <div className="flex flex-col gap-y-1">
                                <FieldLabel
                                  aria-invalid={isInvalid}
                                  htmlFor={field.name}
                                >
                                  Public
                                </FieldLabel>
                                <p className="text-muted-foreground text-xs">
                                  Make the book public
                                </p>
                              </div>
                              {isInvalid ? (
                                <FieldError className="text-xs" />
                              ) : null}
                            </Label>
                          </Field>
                        )
                      }}
                    </form.Field>
                    <DialogFooter>
                      <DialogClose render={<Button variant="outline" />}>
                        Cancel
                      </DialogClose>
                      <form.Subscribe
                        selector={(state) => [
                          state.canSubmit,
                          state.isSubmitting
                        ]}
                      >
                        {([canSubmit, isSubmitting]) => (
                          <Button
                            disabled={!canSubmit || isSubmitting}
                            type="submit"
                          >
                            {isSubmitting ? <Loader /> : "Save"}
                          </Button>
                        )}
                      </form.Subscribe>
                    </DialogFooter>
                  </FieldGroup>
                </FieldSet>
              </form>
            </DialogContent>
          </Dialog>

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
                  <span className="max-w-xs text-ellipsis">
                    Delete {book.name}
                  </span>
                  ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  {book.name}
                  {pagesCount !== 0
                    ? ` and its ${pagesCount} ${pageLabel}.`
                    : "."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isPending}
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  disabled={isPending}
                  onClick={() => handleDeleteBookById({ id: book.id })}
                  variant="destructive"
                >
                  <LoadingSwap isLoading={isPending}>{"Continue"}</LoadingSwap>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  )
}

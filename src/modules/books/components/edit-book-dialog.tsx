"use client"

import { useForm } from "@tanstack/react-form"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { updateBookById } from "@/modules/books/actions"
import { createBookSchema } from "@/modules/books/schema"

type EditBookDialogProps = {
  bookId: string
  bookName: string
  bookIsPublic: boolean
}

export function EditBookDialog({
  bookId,
  bookName,
  bookIsPublic,
}: EditBookDialogProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm({
    defaultValues: {
      name: bookName,
      isPublic: bookIsPublic,
    },
    validators: {
      onChangeAsync: createBookSchema,
    },
    onSubmit: async ({
      value,
    }: {
      value: z.infer<typeof createBookSchema>
    }) => {
      const response = await updateBookById({
        id: bookId,
        values: value,
      })
      if (!response.success) {
        toast.error("Failed to update book")
        return
      }
      toast.success("Book updated successfully")
      router.refresh()
      setIsEditing(false)
    },
  })

  return (
    <Dialog onOpenChange={setIsEditing} open={isEditing}>
      <DialogTrigger
        render={
          <Button aria-label="Edit book" size="icon-sm" variant="outline">
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit book</DialogTitle>
          <DialogDescription>Update your book configuration.</DialogDescription>
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
                    !!field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel aria-invalid={isInvalid} htmlFor={field.name}>
                        Name
                      </FieldLabel>
                      <Input
                        aria-invalid={isInvalid}
                        autoComplete="off"
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Book name…"
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
                    !!field.state.meta.isTouched && !field.state.meta.isValid
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
                        {isInvalid ? <FieldError className="text-xs" /> : null}
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
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                  {([canSubmit, isSubmitting]) => (
                    <Button disabled={!canSubmit || isSubmitting} type="submit">
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
  )
}

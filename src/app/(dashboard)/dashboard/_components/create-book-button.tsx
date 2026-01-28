"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { z } from "zod"
import { useAppForm } from "@/components/forms/form-context"
import { Button } from "@/components/ui/button"
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
import { FieldGroup, FieldSet } from "@/components/ui/field"
import { createBookSchema } from "@/db/schemas/books"
import { createBook } from "@/server/books"

export const CreateBookButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useAppForm({
    defaultValues: {
      name: "",
      isPublic: false
    },
    validators: {
      onSubmit: createBookSchema
    },
    onSubmit: async ({
      value
    }: {
      value: z.infer<typeof createBookSchema>
    }) => {
      try {
        const response = await createBook({
          ...value
        })
        if (response.success) {
          toast.success("Book created successfully")
          setIsOpen(!isOpen)
          form.reset()
          return
        }
        toast.error(response.error.type)
      } catch {
        toast.error("Failed to create book")
      }
    }
  })

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger render={<Button size={"sm"}>Create book</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create book</DialogTitle>
          <DialogDescription>Create a new book config.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldSet>
            <FieldGroup>
              <form.AppField name="name">
                {(field) => (
                  <field.TextField label="Name" placeholder="Book name" />
                )}
              </form.AppField>
              <form.AppField name="isPublic">
                {(field) => (
                  <field.SelectCardField
                    description="Make the book public"
                    label="Public"
                    orientation="horizontal"
                  />
                )}
              </form.AppField>
              <DialogFooter>
                <DialogClose
                  onClick={() => form.reset()}
                  render={<Button variant="outline" />}
                >
                  Cancel
                </DialogClose>
                <form.AppForm>
                  <form.SubmitButton>Create</form.SubmitButton>
                </form.AppForm>
              </DialogFooter>
            </FieldGroup>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}

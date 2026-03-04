"use client"

import { useRouter } from "next/navigation"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup, FieldSet } from "@/components/ui/field"
import { createBook } from "../actions"
import { createBookSchema } from "../schema"

export const CreateBookButton = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const form = useAppForm({
    defaultValues: {
      name: "",
      isPublic: false,
    },
    validators: {
      onSubmit: createBookSchema,
    },
    onSubmit: async ({
      value,
    }: {
      value: z.infer<typeof createBookSchema>
    }) => {
      try {
        const response = await createBook({
          ...value,
        })
        if (response.success) {
          toast.success("Book created successfully")
          router.refresh()
          setIsOpen(!isOpen)
          form.reset()
          return
        }
        toast.error(response.error.type)
      } catch {
        toast.error("Failed to create book")
      }
    },
  })

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger render={<Button size={"sm"}>Create Book</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Book</DialogTitle>
          <DialogDescription>Create a new book.</DialogDescription>
        </DialogHeader>
        <form.AppForm>
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
                    <field.InputField label="Name" placeholder="Book name" />
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
                  <form.SubmitButton>Create</form.SubmitButton>
                </DialogFooter>
              </FieldGroup>
            </FieldSet>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  )
}

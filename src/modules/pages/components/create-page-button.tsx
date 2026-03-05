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
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup, FieldSet } from "@/components/ui/field"
import { createPage } from "../actions"
import { createPageSchema, emptyContent } from "../schema"

export const CreatePageButton = ({ bookId }: { bookId: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useAppForm({
    defaultValues: {
      title: "",
      content: emptyContent,
      isPublic: false,
    },
    validators: {
      onSubmit: createPageSchema,
    },
    onSubmit: async ({
      value,
    }: {
      value: z.infer<typeof createPageSchema>
    }) => {
      try {
        const response = await createPage({
          ...value,
          bookId,
        })
        if (response.success) {
          toast.success("Page created successfully")
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
      <DialogTrigger render={<Button size={"sm"}>Create Page</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Page</DialogTitle>
          <DialogDescription>Create a new page.</DialogDescription>
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
                <form.AppField name="title">
                  {(field) => (
                    <field.InputField label="title" placeholder="Book name" />
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

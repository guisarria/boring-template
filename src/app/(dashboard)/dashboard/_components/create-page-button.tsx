"use client"

import { useForm } from "@tanstack/react-form"
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
  DialogTrigger
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "@/components/ui/loader"
import { createPageSchema } from "@/db/schemas/pages"
import { createPage } from "@/server/pages"

export const CreatePageButton = ({ bookId }: { bookId: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      title: "",
      content: {},
      isPublic: false
    },
    validators: {
      onChangeAsync: createPageSchema
    },
    onSubmit: async ({
      value
    }: {
      value: z.infer<typeof createPageSchema>
    }) => {
      const response = await createPage({
        ...value,
        bookId
      })
      if (response.success) {
        toast.success("Page created successfully")
        setIsOpen(false)
        return
      }
      toast.error(response.error.type)
    }
  })

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger
        render={
          <Button className="w-max" size={"sm"}>
            Create page
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <form
          className="gap-0"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <DialogHeader>
            <DialogTitle>Create Page</DialogTitle>
            <DialogDescription>
              Create a new note to store your notes.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4 flex flex-col gap-4 px-6">
            <form.Field name="title">
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
                      placeholder="My Page"
                      value={field.state.value}
                    />
                    {isInvalid ? <FieldError className="text-xs" /> : null}
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
                          Make the page public
                        </p>
                      </div>
                      {isInvalid ? <FieldError className="text-xs" /> : null}
                    </Label>
                  </Field>
                )
              }}
            </form.Field>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button disabled={!canSubmit || isSubmitting} type="submit">
                  {isSubmitting ? <Loader /> : "Create"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

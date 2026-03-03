"use client"

import { useId } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { useFieldContext } from "../form-context"

type FieldProps = {
  label: string
  placeholder?: string
  autoComplete?: string
}

export function SelectCardField({
  label,
  description,
  orientation = "vertical",
}: FieldProps & {
  description?: string
  orientation?: "horizontal" | "vertical"
}) {
  const field = useFieldContext<boolean>()
  const errorId = useId()
  const isInvalid = !!field.state.meta.isTouched && !field.state.meta.isValid
  const errors = field.state.meta.errors

  return (
    <FieldLabel data-invalid={isInvalid} htmlFor={field.name}>
      <Field orientation={orientation}>
        <FieldContent>
          <FieldTitle aria-invalid={isInvalid}>{label}</FieldTitle>
          {description && <FieldDescription>{description}</FieldDescription>}
        </FieldContent>
        <Checkbox
          aria-invalid={isInvalid}
          checked={field.state.value}
          id={field.name}
          onCheckedChange={(checked) => field.handleChange(!!checked)}
        />
        {isInvalid && <FieldError errors={errors} id={errorId} />}
      </Field>
    </FieldLabel>
  )
}

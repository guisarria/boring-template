"use client"

import { Textarea } from "@/components/ui/textarea"
import { FieldBase } from "./field-base"

type FieldProps = {
  label: string
  placeholder?: string
  autoComplete?: string
}

export function TextareaField({
  label,
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <FieldBase label={label}>
      {({ field, errorId, isInvalid }) => (
        <Textarea
          aria-describedby={isInvalid ? errorId : undefined}
          aria-invalid={isInvalid}
          autoComplete={autoComplete}
          id={field.name}
          name={field.name}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          value={field.state.value}
        />
      )}
    </FieldBase>
  )
}

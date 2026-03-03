"use client"

import { Input } from "@/components/ui/input"
import { FieldBase } from "./field-base"

type FieldProps = {
  label: string
  placeholder?: string
  autoComplete?: string
}

export function EmailField({
  label,
  placeholder,
  autoComplete = "email",
}: FieldProps) {
  return (
    <FieldBase label={label}>
      {({ field, errorId, isInvalid }) => (
        <Input
          aria-describedby={isInvalid ? errorId : undefined}
          aria-invalid={isInvalid}
          autoComplete={autoComplete}
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          type="email"
          value={field.state.value}
        />
      )}
    </FieldBase>
  )
}

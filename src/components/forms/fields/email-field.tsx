"use client"

import { Input } from "@/components/ui/input"
import { FieldBase, type FieldProps } from "./field-base"

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

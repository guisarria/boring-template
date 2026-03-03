"use client"

import { PasswordInput } from "@/components/ui/password-input"
import { FieldBase } from "./field-base"

type FieldProps = {
  label: string
  placeholder?: string
  autoComplete?: string
}

export function PasswordField({
  label,
  placeholder,
  autoComplete = "current-password",
}: FieldProps) {
  return (
    <FieldBase label={label}>
      {({ field, errorId, isInvalid }) => (
        <PasswordInput
          aria-describedby={isInvalid ? errorId : undefined}
          aria-invalid={isInvalid}
          autoComplete={autoComplete}
          id={field.name}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          value={field.state.value}
        />
      )}
    </FieldBase>
  )
}

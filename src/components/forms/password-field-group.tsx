"use client"

import { useId } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/password-input"
import { useFieldContext, withFieldGroup } from "./form-context"

type PasswordFields = {
  password: string
  confirmPassword: string
}

function PasswordFieldComponent({
  label,
  placeholder,
  autoComplete = "new-password"
}: {
  label: string
  placeholder?: string
  autoComplete?: string
}) {
  const field = useFieldContext<string>()
  const errorId = useId()
  const isInvalid = !!field.state.meta.isTouched && !field.state.meta.isValid
  const errors = field.state.meta.errors

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
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
      {isInvalid && <FieldError errors={errors} id={errorId} />}
    </Field>
  )
}

const defaultValues: PasswordFields = {
  password: "",
  confirmPassword: ""
}

export const PasswordFieldGroup = withFieldGroup({
  defaultValues,
  render({ group }) {
    return (
      <>
        <group.AppField name="password">
          {() => (
            <PasswordFieldComponent
              autoComplete="new-password"
              label="Password"
              placeholder="Enter your password"
            />
          )}
        </group.AppField>
        <group.AppField
          name="confirmPassword"
          validators={{
            onChangeListenTo: ["password"],
            onChange: ({ value }) => {
              if (value !== group.getFieldValue("password")) {
                return "Passwords do not match"
              }
              return undefined
            }
          }}
        >
          {() => (
            <PasswordFieldComponent
              autoComplete="new-password"
              label="Confirm Password"
              placeholder="Confirm your password"
            />
          )}
        </group.AppField>
      </>
    )
  }
})

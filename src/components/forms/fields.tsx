"use client"

import { useId } from "react"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Checkbox } from "../ui/checkbox"
import { useFieldContext } from "./form-context"

type FieldProps = {
  label: string
  placeholder?: string
  autoComplete?: string
}

export function TextField({ label, placeholder, autoComplete }: FieldProps) {
  const field = useFieldContext<string>()
  const errorId = useId()
  const isInvalid = !!field.state.meta.isTouched && !field.state.meta.isValid
  const errors = field.state.meta.errors

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        aria-describedby={isInvalid ? errorId : undefined}
        aria-invalid={isInvalid}
        autoComplete={autoComplete}
        id={field.name}
        name={field.name}
        // onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        value={field.state.value}
      />
      {isInvalid && <FieldError errors={errors} id={errorId} />}
    </Field>
  )
}

export function EmailField({
  label,
  placeholder,
  autoComplete = "email"
}: FieldProps) {
  const field = useFieldContext<string>()
  const errorId = useId()
  const isInvalid = !!field.state.meta.isTouched && !field.state.meta.isValid
  const errors = field.state.meta.errors

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
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
      {isInvalid && <FieldError errors={errors} id={errorId} />}
    </Field>
  )
}

export function PasswordField({
  label,
  placeholder,
  autoComplete = "current-password"
}: FieldProps) {
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

export function SelectCardField({
  label,
  description,
  orientation = "vertical"
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

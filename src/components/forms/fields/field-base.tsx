import { useId } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useFieldContext } from "../form-context"

type FieldBaseProps = {
  label: string
  children: (props: {
    field: ReturnType<typeof useFieldContext<string>>
    errorId: string
    isInvalid: boolean
  }) => React.ReactNode
}

export function FieldBase({ label, children }: FieldBaseProps) {
  const field = useFieldContext<string>()
  const errorId = useId()
  const isInvalid = !!field.state.meta.isTouched && !field.state.meta.isValid
  const errors = field.state.meta.errors

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {children({ field, errorId, isInvalid })}
      {isInvalid && <FieldError errors={errors} id={errorId} />}
    </Field>
  )
}

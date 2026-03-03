import { Activity, useId } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useFieldContext } from "../form-context"

export type FieldProps = {
  label: string
  placeholder?: string
  autoComplete?: string
}

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

  const { isTouched, isValid, errors } = field.state.meta
  const isInvalid = isTouched && !isValid

  return (
    <Field data-invalid={isInvalid || undefined}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {children({ field, errorId, isInvalid })}
      <Activity mode={isInvalid ? "visible" : "hidden"}>
        <FieldError errors={errors} id={errorId} />
      </Activity>
    </Field>
  )
}

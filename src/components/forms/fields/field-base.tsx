import { Activity, useId } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useFieldContext } from "../form-context"

type FieldBaseProps<T = string> = {
  label: string
  children: (props: {
    field: ReturnType<typeof useFieldContext<T>>
    errorId: string
    isInvalid: boolean
  }) => React.ReactNode
}

export type FieldProps = Pick<FieldBaseProps, "label"> & {
  placeholder?: string
  autoComplete?: string
}

export function FieldBase<T = string>({ label, children }: FieldBaseProps<T>) {
  const field = useFieldContext<T>()
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

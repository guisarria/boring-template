import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { EmailField, PasswordField, SelectCardField, TextField } from "./fields"
import { SubmitButton } from "./submit-button"

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    EmailField,
    PasswordField,
    SelectCardField
  },
  formComponents: {
    SubmitButton
  }
})

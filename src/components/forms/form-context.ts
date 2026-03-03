import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { EmailField } from "./fields/email-field"
import { InputField } from "./fields/input-field"
import { PasswordField } from "./fields/password-field"
import { SelectCardField } from "./fields/select-card-field"
import { TextareaField } from "./fields/textarea-field"
import { SubmitButton } from "./submit-button"

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
    EmailField,
    PasswordField,
    SelectCardField,
    TextareaField,
  },
  formComponents: {
    SubmitButton,
  },
})

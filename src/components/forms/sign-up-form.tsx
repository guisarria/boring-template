"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAppForm } from "@/components/forms/form-context"
import { PasswordFieldGroup } from "@/components/forms/password-field-group"
import { SocialButtons } from "@/components/forms/social-buttons"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { FieldSet } from "@/components/ui/field"
import { signUpUser } from "@/server/users"
import { type SignUpSchema, signUpSchema } from "@/types/sign-up-schema"

export function SignUpForm() {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    } satisfies SignUpSchema,
    validators: {
      onSubmit: signUpSchema
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await signUpUser(
          value.name,
          value.email,
          value.password
        )
        if (response?.success) {
          toast.success("Account created successfully!")
          form.reset()
          router.push("/dashboard")
          return
        }
        toast.error(response?.error.type)
      } catch {
        toast.error("Unable to sign up, please try again.")
      }
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Let's create your account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form.AppForm>
          <form
            id="sign-up"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldSet>
              <SocialButtons />
              <form.AppField name="name">
                {(field) => (
                  <field.TextField label="Name" placeholder="Enter your name" />
                )}
              </form.AppField>
              <form.AppField name="email">
                {(field) => (
                  <field.EmailField
                    label="Email address"
                    placeholder="Enter your email address"
                  />
                )}
              </form.AppField>
              <PasswordFieldGroup
                fields={{
                  password: "password",
                  confirmPassword: "confirmPassword"
                }}
                form={form}
              />
              <form.SubmitButton>Continue with Email</form.SubmitButton>
            </FieldSet>
          </form>
        </form.AppForm>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-center gap-x-1 text-center text-sm">
          <p>Already have an account?</p>
          <Link className="underline underline-offset-2" href="/sign-in">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

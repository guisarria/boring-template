"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import { useAppForm } from "@/components/forms/form-context"
import { PasswordFieldGroup } from "@/components/forms/password-field-group"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldSeparator, FieldSet } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { signUpUser } from "../actions"
import { type SignUp, signUpSchema } from "../validations/sign-up"
import { SocialAuthButtons } from "./social-auth-buttons"

export function SignUpForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    } satisfies SignUp,
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const response = await signUpUser(value)
        if (response.success) {
          toast.success("Signed up successfully!")
          form.reset()
          router.push("/dashboard")
          return
        }
      })
    },
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
              <SocialAuthButtons />
              <FieldSeparator />
              <form.AppField name="name">
                {(field) => (
                  <field.TextField label="Name" placeholder="Jane Doe" />
                )}
              </form.AppField>
              <form.AppField name="email">
                {(field) => (
                  <field.EmailField
                    label="Email address"
                    placeholder="you@example.com"
                  />
                )}
              </form.AppField>
              <PasswordFieldGroup
                fields={{
                  password: "password",
                  confirmPassword: "confirmPassword",
                }}
                form={form}
              />
              <form.SubmitButton isPending={isPending}>
                Continue with Email
              </form.SubmitButton>
            </FieldSet>
          </form>
        </form.AppForm>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-center gap-x-1 text-center text-xs sm:text-sm">
          <p>Already have an account?</p>
          <Link
            className={cn(
              buttonVariants({ variant: "link", size: "xs" }),
              "px-0",
            )}
            href="/sign-in"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAppForm } from "@/components/forms/form-context"
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
import { signInUser } from "../actions"
import { type SignIn, signInSchema } from "../validations/sign-in"
import { SocialAuthButtons } from "./social-auth-buttons"

export function SignInForm() {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies SignIn,
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await signInUser(value)
        if (response.success) {
          toast.success("Signed in successfully!")
          form.reset()
          router.push("/dashboard")
          return
        }
        toast.error(response.error.type)
      } catch {
        toast.error("It was not possible to sign in")
      }
    },
  })

  return (
    <Card className="w-full sm:w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to sign in
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form.AppForm>
          <form
            id="sign-in"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldSet>
              <form.AppField name="email">
                {(field) => (
                  <field.EmailField
                    label="Email address"
                    placeholder="you@example.com"
                  />
                )}
              </form.AppField>
              <form.AppField name="password">
                {(field) => (
                  <field.PasswordField
                    label="Password"
                    placeholder="••••••••"
                  />
                )}
              </form.AppField>
              <form.SubmitButton>Continue with Email</form.SubmitButton>
              <FieldSeparator />
              <SocialAuthButtons />
            </FieldSet>
          </form>
        </form.AppForm>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-center gap-x-1 text-center text-xs sm:text-sm">
          <p>Don&apos;t have an account?</p>
          <Link
            className={cn(
              buttonVariants({ variant: "link", size: "xs" }),
              "px-0",
            )}
            href="/sign-up"
            prefetch
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

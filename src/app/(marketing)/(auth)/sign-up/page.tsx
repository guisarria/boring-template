import type { Metadata } from "next"
import { Suspense } from "react"
import { SignUpForm } from "@/modules/auth/components/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up",
}

export default function Page() {
  return (
    <div className="flex h-full flex-col items-center justify-center pb-12">
      <Suspense>
        <SignUpForm />
      </Suspense>
    </div>
  )
}

import type { Metadata } from "next"
import { Suspense } from "react"
import { SignInForm } from "@/modules/auth/components/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In",
}

export default function Page() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-4 pb-12">
      <Suspense>
        <SignInForm />
      </Suspense>
    </div>
  )
}

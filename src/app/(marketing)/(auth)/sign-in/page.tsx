import { Suspense } from "react"
import { SignInForm } from "@/components/forms/sign-in-form"

export default function Page() {
  return (
    <div className="flex h-full flex-col items-center justify-center pb-12">
      <Suspense>
        <SignInForm />
      </Suspense>
    </div>
  )
}

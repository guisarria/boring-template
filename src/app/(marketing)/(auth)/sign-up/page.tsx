import { Suspense } from "react"
import { SignUpForm } from "@/components/forms/sign-up-form"

export default function Page() {
  return (
    <div className="flex h-full flex-col items-center justify-center pb-12">
      <Suspense>
        <SignUpForm />
      </Suspense>
    </div>
  )
}

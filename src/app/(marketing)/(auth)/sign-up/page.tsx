import { Suspense } from "react"
import { SignUpForm } from "@/components/forms/sign-up-form"

export default function Page() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center">
        <Suspense>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  )
}

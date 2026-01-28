"use client"

import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { useFormContext } from "./form-context"

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) => ({
        canSubmit: state.canSubmit,
        isSubmitting: state.isSubmitting
      })}
    >
      {({ canSubmit, isSubmitting }) => (
        <Button disabled={!canSubmit || isSubmitting} type="submit">
          <LoadingSwap isLoading={isSubmitting}>{children}</LoadingSwap>
        </Button>
      )}
    </form.Subscribe>
  )
}

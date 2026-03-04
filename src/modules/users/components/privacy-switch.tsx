"use client"

import { useRouter } from "next/navigation"
import { useOptimistic, useTransition } from "react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { updatePublicUserSettings } from "@/modules/users/actions"

export const PrivacySwitch = ({
  initialPrivateAccount,
}: {
  initialPrivateAccount: boolean
}) => {
  const [isPending, startTransition] = useTransition()
  const [optimisticPrivate, setOptimisticPrivate] = useOptimistic(
    initialPrivateAccount,
    (newStatus: boolean) => newStatus,
  )

  const router = useRouter()

  const handleCheckedChange = (checked: boolean) => {
    startTransition(async () => {
      setOptimisticPrivate(checked)
      const result = await updatePublicUserSettings(checked)
      if (result.success) {
        toast.success("Privacy settings updated")
        router.refresh()
      } else {
        toast.error("Failed to update privacy settings")
        setOptimisticPrivate(!checked)
      }
    })
  }

  return (
    <Switch
      checked={optimisticPrivate}
      disabled={isPending}
      onCheckedChange={handleCheckedChange}
    />
  )
}

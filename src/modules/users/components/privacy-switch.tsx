"use client"

import { useRouter } from "next/navigation"
import { useOptimistic, useTransition } from "react"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import type { User } from "@/modules/auth/types"
import { updatePublicUserSettings } from "@/modules/users/actions"

export const PrivacySwitch = ({
  user,
  initialPrivateAccount,
}: {
  user: User
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
      const result = await updatePublicUserSettings(user, checked)
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

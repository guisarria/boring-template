"use client"

import { LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { authClient } from "../auth-client"

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  return (
    <Button
      className={cn("gap-2", className)}
      onClick={handleSignOut}
      size="sm"
      variant={"outline"}
    >
      <LogOutIcon />
      Sign out
    </Button>
  )
}

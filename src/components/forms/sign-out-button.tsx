"use client"

import { LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
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

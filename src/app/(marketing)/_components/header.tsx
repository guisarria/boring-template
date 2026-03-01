import { EyeClosed } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignInButton } from "@/modules/auth/components/sign-in-button"

export const Header = () => (
  <div className="container flex w-full items-center justify-between px-4 py-4 sm:px-0">
    <Link href="/">
      <EyeClosed className="ml-2 text-cyan-200" />
    </Link>
    <div className="flex items-center justify-end gap-x-2">
      <SignInButton />

      <ThemeToggle />
    </div>
  </div>
)

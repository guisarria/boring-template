import { EyeClosed } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { SignInButton } from "@/components/forms/sign-in-button"
import { ThemeToggle } from "./theme-toggle"
import { Skeleton } from "./ui/skeleton"

export const Header = () => (
  <div className="container flex w-full items-center justify-between py-4">
    <Link href="/">
      <EyeClosed className="ml-2 text-cyan-200" />
    </Link>
    <div className="flex items-center justify-end gap-x-2">
      <Suspense fallback={<Skeleton className="h-7 w-22 rounded-lg" />}>
        <SignInButton />
      </Suspense>

      <ThemeToggle />
    </div>
  </div>
)

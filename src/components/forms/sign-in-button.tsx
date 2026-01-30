import { LogIn, PanelTop } from "lucide-react"
import Link from "next/link"
import { getServerAction } from "../../lib/auth/server"

export async function SignInButton() {
  const user = await getServerAction()

  const isLoggedIn = user?.id

  return (
    <Link
      className="inline-flex h-7 shrink-0 select-none items-center justify-center gap-1 whitespace-nowrap rounded-[min(var(--radius-md),12px)] rounded-lg border border-border bg-background bg-clip-padding px-2.5 font-medium text-[0.8rem] text-sm outline-none transition-all hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0"
      href={isLoggedIn ? "/dashboard" : "/sign-in"}
    >
      {isLoggedIn ? (
        <>
          <PanelTop />
          Dashboard
        </>
      ) : (
        <>
          <LogIn />
          Sign In
        </>
      )}
    </Link>
  )
}

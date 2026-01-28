import { SignOutButton } from "@/components/forms/sign-out-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"

type PageWrapperProps = {
  children: React.ReactNode
  breadcrumb: React.ReactNode
}

export function PageWrapper({ children, breadcrumb }: PageWrapperProps) {
  return (
    <div className="flex h-full flex-col gap-y-2">
      <header className="flex items-center px-6 py-4 pb-1">
        <div className="flex w-full items-center justify-between">
          <div className="flex w-1/3 items-center gap-2">
            <SidebarTrigger />
            {breadcrumb}
          </div>
          <div className="ml-auto flex w-1/3 items-center justify-end gap-2 self-end">
            <SignOutButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-y-6 p-6 pt-0 pl-7">
        {children}
      </div>
    </div>
  )
}

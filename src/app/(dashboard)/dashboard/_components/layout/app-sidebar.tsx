import { HouseIcon, PanelLeft, SettingsIcon } from "lucide-react"
import Link from "next/link"
import { type ComponentProps, Suspense } from "react"
import { SearchForm } from "@/app/(dashboard)/dashboard/_components/layout/search-form"
import { BoringAvatar } from "@/components/boring-avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { getServerSession } from "@/modules/auth/server"
import { getSidebarBooks } from "@/modules/books/actions"
import { SidebarData, SidebarLogo } from "./sidebar-data"

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenuButton render={<SidebarLogo />} />
        <Suspense>
          <SearchForm />
        </Suspense>
      </SidebarHeader>

      <Suspense>
        <SidebarContentData />
      </Suspense>

      <Suspense>
        <SidebarFooterdata />
      </Suspense>

      <SidebarRail />
    </Sidebar>
  )
}

const SidebarContentData = async () => {
  const result = await getSidebarBooks()

  if (!result.success) {
    return <SidebarContent />
  }

  const books = result.data

  const data = {
    navMain: [
      ...(books.map((book) => ({
        title: book.name,
        url: `/dashboard/book/${book.id}`,
        items: book.pages.map((page) => ({
          title: page.title,
          url: `/dashboard/book/${book.id}/page/${page.id}`,
        })),
      })) ?? []),
    ],
  }

  return (
    <SidebarContent>
      <SidebarData data={data} />
    </SidebarContent>
  )
}

const SidebarFooterdata = async () => {
  const { ...user } = await getServerSession()

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex items-center justify-start py-6",
              )}
              render={
                <SidebarMenuButton>
                  <BoringAvatar
                    className="min-h-8 min-w-10"
                    name={user.user.email}
                    size={90}
                  />
                  <span>{user.user.name ?? "User"}</span>
                </SidebarMenuButton>
              }
            />
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem
                  render={
                    <Link
                      className="flex items-center gap-x-2"
                      href={"/dashboard"}
                    >
                      <PanelLeft />
                      Dashboard
                    </Link>
                  }
                />
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={
                    <Link
                      className="flex items-center gap-x-2"
                      href={"/dashboard/settings"}
                    >
                      <SettingsIcon />
                      Settings
                    </Link>
                  }
                />
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={
                    <Link className="flex items-center gap-x-2" href={"/"}>
                      <HouseIcon />
                      Home Page
                    </Link>
                  }
                />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

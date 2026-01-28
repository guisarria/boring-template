import { AppSidebar } from "@/app/(dashboard)/dashboard/_components/app-sidebar"
import { PageWrapper } from "@/app/(dashboard)/dashboard/_components/page-wrapper"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
  breadcrumb
}: {
  children: React.ReactNode
  breadcrumb: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <PageWrapper breadcrumb={breadcrumb}>{children}</PageWrapper>
      </main>
    </SidebarProvider>
  )
}

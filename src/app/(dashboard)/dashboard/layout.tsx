import { NuqsAdapter } from "nuqs/adapters/next/app"
import { AppSidebar } from "@/app/(dashboard)/dashboard/_components/layout/app-sidebar"
import { PageWrapper } from "@/app/(dashboard)/dashboard/_components/layout/page-wrapper"
import { QueryProvider } from "@/components/query-provider"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
  breadcrumb,
}: {
  children: React.ReactNode
  breadcrumb: React.ReactNode
}) {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            <PageWrapper breadcrumb={breadcrumb}>{children}</PageWrapper>
          </main>
        </SidebarProvider>
      </NuqsAdapter>
    </QueryProvider>
  )
}

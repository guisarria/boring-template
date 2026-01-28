import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { getPageById } from "@/server/pages"

type Params = Promise<{
  bookId: string
  pageId: string
}>

export default async function PageBreadcrumb({ params }: { params: Params }) {
  const { bookId, pageId } = await params

  const result = await getPageById(pageId, {
    id: true,
    title: true
  })

  const page = result.success ? result.data?.page : null
  const bookName = page?.book.name ?? "Book"
  const pageTitle = page?.title ?? "Page"

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/dashboard">Dashboard</Link>} />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            render={<Link href={`/dashboard/book/${bookId}`}>{bookName}</Link>}
          />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            render={
              <Link href={`/dashboard/book/${bookId}/page/${pageId}`}>
                {pageTitle}
              </Link>
            }
          />
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

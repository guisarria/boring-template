import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { getBookById } from "@/server/books"

type Params = Promise<{
  bookId: string
}>

export default async function BookBreadcrumb({ params }: { params: Params }) {
  const { bookId } = await params

  const result = await getBookById({
    id: bookId,
    columns: { name: true }
  })

  const bookName = result.success ? result.data?.name : "Book"

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
      </BreadcrumbList>
    </Breadcrumb>
  )
}

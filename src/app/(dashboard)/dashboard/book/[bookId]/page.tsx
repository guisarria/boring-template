import type { Metadata } from "next"
import { assertSuccess } from "@/core/dal"
import { getBookById } from "@/modules/books/actions"
import { CreatePageButton } from "@/modules/pages/components/create-page-button"
import { PageCard } from "@/modules/pages/components/page-card"
import type { Page as BookPage } from "@/modules/pages/schema"

type Params = Promise<{
  bookId: string
}>

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Book | Boring Template",
    description: "View and manage pages",
  }
}

export default async function Page({ params }: { params: Params }) {
  const { bookId } = await params

  const result = await getBookById({
    id: bookId,
    columns: {
      id: true,
      name: true,
    },
  })

  assertSuccess(result)

  const book = result.data

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <h1 className="font-serif text-5xl">{book?.name ?? "Book"}</h1>
        <div className="mt-auto self-end">
          <CreatePageButton bookId={bookId} />
        </div>
      </div>

      <div className="mx-auto flex w-full flex-wrap gap-8">
        {book?.pages?.map((page: BookPage) => (
          <PageCard key={page.id} page={page} />
        ))}
      </div>

      {book?.pages?.length === 0 && <div>No pages found</div>}
    </>
  )
}

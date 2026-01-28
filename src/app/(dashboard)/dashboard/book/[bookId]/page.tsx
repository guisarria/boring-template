import type { Metadata } from "next"
import { handleError } from "@/lib/dal/helpers"
import { getBookById } from "@/server/books"
import { CreatePageButton } from "../../_components/create-page-button"
import PageCard from "../../_components/page-card"

type Params = Promise<{
  bookId: string
}>

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Book | Boring Template",
    description: "View and manage pages"
  }
}

export default async function BookPage({ params }: { params: Params }) {
  const { bookId } = await params

  const result = await getBookById({
    id: bookId,
    columns: {
      id: true,
      isPublic: true,
      name: true,
      pages: true
    }
  })

  if (!result.success) {
    return handleError(result.error)
  }

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
        {book?.pages?.map((page) => (
          <PageCard key={page.id} page={page} />
        ))}
      </div>

      {book?.pages?.length === 0 && <div>No pages found</div>}
    </>
  )
}

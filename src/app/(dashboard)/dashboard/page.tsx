import { BooksCardGrid } from "./_components/books-card-grid"
import { CreateBookButton } from "./_components/create-book-button"

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <h1 className="font-serif text-5xl">Books</h1>
        <div className="mt-auto flex gap-x-2 self-end">
          <CreateBookButton />
        </div>
      </div>

      <BooksCardGrid />
    </>
  )
}

import { assertSuccess } from "@/core/dal"
import { getUserBooks } from "@/modules/books/actions"
import { BookCard } from "./book-card"

export const BooksCardGrid = async () => {
  const result = await getUserBooks()

  assertSuccess(result)

  const books = result.data

  return (
    <div className="mx-auto flex w-full flex-wrap gap-8">
      {books.map((book) => (
        <BookCard book={book} key={book.id} />
      ))}

      {books.length === 0 && (
        <div>
          <p>No books found</p>
        </div>
      )}
    </div>
  )
}

import { handleError } from "@/lib/dal/helpers"
import { getUserBooks } from "@/server/books"
import BookCard from "./book-card"

export const BooksCardGrid = async () => {
  const result = await getUserBooks({
    columns: {
      id: true,
      userId: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      isPublic: true
    }
  })

  if (!result.success) {
    handleError(result.error)
  }

  const books = result.data

  return (
    <div className="mx-auto flex w-full flex-wrap gap-8">
      {books?.map((book) => (
        <BookCard book={book} key={book.id} />
      ))}

      {books?.length === 0 && (
        <div>
          <p>No books found</p>
        </div>
      )}
    </div>
  )
}

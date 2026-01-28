import type { JSONContent } from "@tiptap/core"
import { RichTextEditor } from "@/app/(dashboard)/dashboard/_components/rich-text-editor"
import { handleError } from "@/lib/dal/helpers"
import { getPageById } from "@/server/pages"

type Params = Promise<{
  pageId: string
}>

export default async function PagePage({ params }: { params: Params }) {
  const { pageId } = await params

  const result = await getPageById(pageId, {
    id: true,
    title: true,
    content: true
  })

  if (!result.success) {
    return handleError(result.error)
  }

  const page = result.data?.page
  if (!page) {
    return <div>Page not found</div>
  }

  return (
    <>
      <h1 className="font-serif text-5xl">{page.title}</h1>

      <RichTextEditor content={page.content as JSONContent} pageId={pageId} />
    </>
  )
}

import type { JSONContent } from "@tiptap/core"
import { assertSuccess } from "@/core/dal"
import { getPageById } from "@/modules/pages/actions"
import { RichTextEditor } from "@/modules/pages/components/rich-text-editor"

type Params = Promise<{
  pageId: string
}>

export default async function Page({ params }: { params: Params }) {
  const { pageId } = await params

  const result = await getPageById(pageId, {
    id: true,
    title: true,
    content: true,
  })

  assertSuccess(result)

  const page = result.data?.page

  return (
    <>
      <h1 className="font-serif text-5xl">{page?.title}</h1>

      <RichTextEditor content={page?.content as JSONContent} pageId={pageId} />
    </>
  )
}

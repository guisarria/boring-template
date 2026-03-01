"use client"

import "@/styles/highlight.css"
import type { Editor } from "@tiptap/react"
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react"
import { AlertCircle, Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { useDebounceCallback } from "@/hooks/use-debounce-callback"
import { cn } from "@/lib/utils"
import { updatePageContent } from "@/modules/pages/actions"
import { extensions } from "./editor-extensions"
import { EditorToolbar } from "./editor-toolbar"
import { expandJSON } from "./expand-json"

type RichTextEditorProps = {
  content?: JSONContent
  pageId?: string
}

type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error"

const EDITOR_CONTENT_CLASS = cn(
  "prose xl:prose-lg prose-neutral dark:prose-invert prose-h2:my-4 prose-p:mt-0 prose-p:mb-0 h-full min-h-96 w-full min-w-full flex-1 text-pretty prose:font-sans prose-h1:text-orange-300 prose-h2:text-red-300 prose-h3:text-cyan-200 prose-headings:tracking-wide tracking-normal",
  "prose-headings:font-normal",
  "prose-hr:my-4 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
  "prose-strong:font-semibold prose-p:text-foreground",
  "prose-a:font-normal prose-a:underline prose-a:decoration-primary",
  "prose-pre:overflow-x-auto prose-pre:rounded prose-pre:border prose-pre:bg-muted prose-pre:font-mono dark:prose-pre:bg-muted/25",
  "prose-code:rounded prose-code:bg-muted prose-code:p-1 prose-code:font-normal prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-muted/90",
  "whitespace-pre-wrap prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:text-foreground prose-blockquote:not-italic",
  "[&_.ProseMirror]:focus:outline-none [&_.Prosemirror>*]:my-0",
  "[&_.ProseMirror_code]:font-mono [&_.ProseMirror_pre>code]:bg-transparent",
)

function normalizeContent(content?: JSONContent): JSONContent | undefined {
  if (
    content &&
    typeof content === "object" &&
    "type" in content &&
    content.type === "doc"
  ) {
    return content
  }
  return undefined
}

function SaveIndicator({
  onRetry,
  status,
}: {
  onRetry: () => void
  status: SaveStatus
}) {
  if (status === "saving") {
    return <Loader className="absolute right-4 bottom-4" />
  }

  if (status === "saved") {
    return (
      <Check className="absolute right-4 bottom-4 size-4 text-muted-foreground" />
    )
  }

  if (status === "error") {
    return (
      <div className="absolute right-4 bottom-4 flex items-center gap-2">
        <AlertCircle className="size-4 text-destructive" />
        <Button onClick={onRetry} size="sm" variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return null
}

export function RichTextEditor({ content, pageId }: RichTextEditorProps) {
  const [status, setStatus] = useState<SaveStatus>("idle")
  const pendingRef = useRef<JSONContent | null>(null)
  const isSavingRef = useRef(false)

  const processQueue = async () => {
    if (isSavingRef.current || !pageId) {
      return
    }

    const next = pendingRef.current
    if (!next) {
      return
    }

    pendingRef.current = null
    isSavingRef.current = true
    setStatus("saving")

    try {
      await updatePageContent(pageId, next)
      isSavingRef.current = false

      if (pendingRef.current) {
        processQueue()
      } else {
        setStatus("saved")
      }
    } catch {
      isSavingRef.current = false
      pendingRef.current = next
      setStatus("error")
    }
  }

  const debouncedSave = useDebounceCallback((expanded: JSONContent) => {
    pendingRef.current = expanded
    setStatus("dirty")
    processQueue()
  }, 2000)

  useEffect(() => () => debouncedSave.flush(), [debouncedSave])

  useEffect(() => {
    if (status !== "saved") {
      return
    }
    const timeout = setTimeout(() => setStatus("idle"), 2000)
    return () => clearTimeout(timeout)
  }, [status])

  const editor = useEditor({
    extensions,
    content: normalizeContent(content),
    immediatelyRender: false,
    injectCSS: false,
    onUpdate: ({ editor }: { editor: Editor }) => {
      const expanded = expandJSON(editor.schema, editor.getJSON())
      setStatus("dirty")
      debouncedSave(expanded)
    },
  })

  return (
    <div className="container inset-shadow-2xs mx-auto flex h-full min-h-200 w-full flex-col overflow-hidden rounded-md border font-sans">
      <EditorToolbar editor={editor} />

      <div className="relative h-full min-h-96 w-full flex-1 p-4 px-8">
        <EditorContent
          className={EDITOR_CONTENT_CLASS}
          editor={editor}
          spellCheck={false}
        />
        <SaveIndicator onRetry={processQueue} status={status} />
      </div>
    </div>
  )
}

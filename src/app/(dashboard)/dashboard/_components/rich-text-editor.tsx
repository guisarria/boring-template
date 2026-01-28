/** biome-ignore-all lint/nursery/noShadow: noShadow */
/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: noExcessiveCognitiveComplexity */

"use client"

import "@/styles/highlight.css"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import LinkExtension from "@tiptap/extension-link"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import type { Schema } from "@tiptap/pm/model"
import {
  type Editor,
  EditorContent,
  type JSONContent,
  useEditor,
  useEditorState
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { all, createLowlight } from "lowlight"
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Italic,
  Link,
  List,
  ListOrdered,
  Redo,
  SquareCode,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline as UnderlineIcon,
  Undo
} from "lucide-react"
import { cache, useState } from "react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Loader } from "@/components/ui/loader"
import { useDebounceCallback } from "@/hooks/use-debounce-callback"
import { cn } from "@/lib/utils"
import { updatePageContent } from "@/server/pages"

export function expandJSON(schema: Schema, json: JSONContent): JSONContent {
  function addDefaultsToNodeOrMark(
    item: JSONContent,
    isMark?: boolean
  ): JSONContent {
    if (!item.type) {
      return item
    }

    const typeKey = item.type
    const schemaItems = isMark ? schema.marks : schema.nodes
    const itemType = schemaItems[typeKey]

    if (itemType?.spec.attrs) {
      const defaultAttrs: Record<string, unknown> = {}
      for (const [key, attr] of Object.entries(itemType.spec.attrs)) {
        const attrSpec = attr as { default?: unknown }
        if (attrSpec.default !== undefined) {
          defaultAttrs[key] = attrSpec.default
        }
      }
      const mergedAttrs = { ...defaultAttrs, ...(item.attrs || {}) }

      if (Object.keys(mergedAttrs).length > 0) {
        item.attrs = mergedAttrs
      } else {
        item.attrs = undefined
      }
    }

    if (!isMark && item.content) {
      item.content = item.content.map((child: JSONContent) =>
        addDefaultsToNodeOrMark(child)
      )
    }

    if (item.marks) {
      item.marks = item.marks.map(
        (mark: NonNullable<JSONContent["marks"]>[number]) =>
          addDefaultsToNodeOrMark(mark, true)
      ) as NonNullable<JSONContent["marks"]>
    }

    return item
  }

  return addDefaultsToNodeOrMark(json, false)
}

const lowlight = createLowlight(all)

const languages = [
  "auto",
  "plaintext",
  "bash",
  "c",
  "cpp",
  "csharp",
  "css",
  "diff",
  "go",
  "graphql",
  "html",
  "ini",
  "java",
  "javascript",
  "json",
  "kotlin",
  "less",
  "lua",
  "makefile",
  "markdown",
  "objectivec",
  "perl",
  "php",
  "python",
  "python-repl",
  "r",
  "ruby",
  "rust",
  "scss",
  "shell",
  "sql",
  "swift",
  "toml",
  "typescript",
  "wasm",
  "xml",
  "yaml"
]

const extensions = [
  Underline,
  CodeBlockLowlight.configure({ lowlight, enableTabIndentation: true }),
  Subscript.configure({ HTMLAttributes: { class: "subscript" } }),
  Superscript.configure({ HTMLAttributes: { class: "superscript" } }),
  StarterKit.configure({
    codeBlock: false,
    link: false,
    underline: false
  }),
  LinkExtension.configure({
    openOnClick: "whenNotEditable",
    defaultProtocol: "https"
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ["left", "center", "right", "justify"],
    defaultAlignment: "left"
  })
]

type RichTextEditorProps = {
  content?: JSONContent
  pageId?: string
}

const RichTextEditor = ({ content, pageId }: RichTextEditorProps) => {
  const [isLinkMenuOpen, setIsLinkMenuOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [update, setUpdate] = useState(false)

  const normalizedContent =
    content &&
    typeof content === "object" &&
    "type" in content &&
    content.type === "doc"
      ? content
      : undefined

  const debouncedUpdate = cache(
    useDebounceCallback(async (updatedContent: JSONContent | unknown) => {
      if (pageId) {
        await updatePageContent(pageId, updatedContent)
        setUpdate(false)
      }
    }, 2000)
  )

  const editor = useEditor({
    extensions,
    content: normalizedContent,
    emitContentError: false,
    immediatelyRender: false,
    autofocus: false,
    editable: true,
    injectCSS: false,
    onUpdate: ({ editor }: { editor: Editor }) => {
      const json = editor.getJSON()
      const expanded = expandJSON(editor.schema, json)
      debouncedUpdate(expanded)
      setUpdate(true)
    }
  })

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return {}
      }
      return {
        isBold: editor.isActive("bold"),
        canBold: editor.can().toggleBold() ?? false,
        isItalic: editor.isActive("italic"),
        canItalic: editor.can().toggleItalic() ?? false,
        isStrike: editor.isActive("strike"),
        canStrike: editor.can().toggleStrike() ?? false,
        isCode: editor.isActive("code"),
        canCode: editor.can().toggleCode() ?? false,
        isUnderline: editor.isActive("underline"),
        canUnderline: editor.can().toggleUnderline() ?? false,
        isLink: editor.isActive("link"),
        isSuperscript: editor.isActive("superscript"),
        canSuperscript: editor.can().toggleSuperscript() ?? false,
        isSubscript: editor.isActive("subscript"),
        canSubscript: editor.can().toggleSubscript() ?? false,
        isAlignLeft: editor.isActive({ textAlign: "left" }),
        isAlignCenter: editor.isActive({ textAlign: "center" }),
        isAlignRight: editor.isActive({ textAlign: "right" }),
        isAlignJustify: editor.isActive({ textAlign: "justify" }),
        isParagraph: editor.isActive("paragraph"),
        isHeading1: editor.isActive("heading", { level: 1 }),
        isHeading2: editor.isActive("heading", { level: 2 }),
        isHeading3: editor.isActive("heading", { level: 3 }),
        isBulletList: editor.isActive("bulletList"),
        isOrderedList: editor.isActive("orderedList"),
        isCodeBlock: editor.isActive("codeBlock"),
        isBlockquote: editor.isActive("blockquote"),
        canUndo: editor.can().undo() ?? false,
        canRedo: editor.can().redo() ?? false
      }
    }
  })

  const getActiveHeading = () => {
    if (editorState?.isHeading1) {
      return "H1"
    }
    if (editorState?.isHeading2) {
      return "H2"
    }
    if (editorState?.isHeading3) {
      return "H3"
    }
    return "P"
  }

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  const currentLanguage = editorState?.isCodeBlock
    ? editor?.getAttributes("codeBlock").language || "auto"
    : "auto"

  const handleSaveLink = () => {
    if (!editor) {
      return
    }
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run()
    }
    setIsLinkMenuOpen(false)
  }

  return (
    <div className="container inset-shadow-2xs mx-auto flex h-full min-h-200 w-full flex-col overflow-hidden rounded-md border font-sans">
      <div className="flex items-center gap-x-2 border-b bg-card p-2 text-muted-foreground">
        <ButtonGroup>
          <Button
            className="text-muted-foreground"
            disabled={!editorState?.canUndo}
            onClick={() => editor?.chain().focus().undo().run()}
            size="icon-sm"
            variant="outline"
          >
            <Undo />
          </Button>
          <Button
            className="text-muted-foreground"
            disabled={!editorState?.canRedo}
            onClick={() => editor?.chain().focus().redo().run()}
            size="icon-sm"
            variant="outline"
          >
            <Redo />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  className="flex min-w-16 items-center justify-between text-muted-foreground"
                  size="sm"
                  variant="outline"
                >
                  {getActiveHeading()}
                  <ChevronDown />
                </Button>
              }
            />
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }
              >
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
              >
                Heading 3
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor?.chain().focus().setParagraph().run()}
              >
                Paragraph
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className={`${
              editorState?.isBulletList
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            size="icon-sm"
            variant="outline"
          >
            <List />
          </Button>
          <Button
            className={`${
              editorState?.isOrderedList
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            size="icon-sm"
            variant="outline"
          >
            <ListOrdered />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            className={`${
              editorState?.isBold
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            data-active={editorState?.isBold ? "true" : "false"}
            disabled={!editorState?.canBold}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            size="icon-sm"
            variant="outline"
          >
            <Bold />
          </Button>
          <Button
            className={`${
              editorState?.isItalic
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            disabled={!editorState?.canItalic}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            size="icon-sm"
            variant="outline"
          >
            <Italic />
          </Button>
          <Button
            className={`${
              editorState?.isStrike
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            disabled={!editorState?.canStrike}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            size="icon-sm"
            variant="outline"
          >
            <Strikethrough />
          </Button>
          <Button
            className={`${
              editorState?.isCode
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            disabled={!editorState?.canCode}
            onClick={() => editor?.chain().focus().toggleCode().run()}
            size="icon-sm"
            variant="outline"
          >
            <Code />
          </Button>
          <Button
            className={`${
              editorState?.isUnderline
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            disabled={!editorState?.canUnderline}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
            size="icon-sm"
            variant="outline"
          >
            <UnderlineIcon />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <DropdownMenu
            onOpenChange={(open) => {
              setIsLinkMenuOpen(open)
              if (!!open && editor) {
                const previousUrl = editor.getAttributes("link").href || ""
                setLinkUrl(previousUrl)
              }
            }}
            open={isLinkMenuOpen}
          >
            <DropdownMenuTrigger
              render={
                <Button
                  className={`${
                    editorState?.isLink
                      ? "bg-accent text-accent-foreground dark:bg-input/50"
                      : ""
                  }`}
                  size="icon-sm"
                  variant="outline"
                >
                  <Link />
                </Button>
              }
            />
            <DropdownMenuContent className="w-64 p-2">
              <Input
                className="mb-2"
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter URL"
                value={linkUrl}
              />
              <div className="flex justify-end gap-2 py-2">
                <Button
                  onClick={() => setIsLinkMenuOpen(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveLink}
                  size="sm"
                  variant={"secondary"}
                >
                  Save
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            className={`${
              editorState?.isSuperscript
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            disabled={!editorState?.canSuperscript}
            onClick={() => editor?.chain().focus().toggleSuperscript().run()}
            size="icon-sm"
            variant="outline"
          >
            <SuperscriptIcon />
          </Button>
          <Button
            className={`${
              editorState?.isSubscript
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            disabled={!editorState?.canSubscript}
            onClick={() => editor?.chain().focus().toggleSubscript().run()}
            size="icon-sm"
            variant="outline"
          >
            <SubscriptIcon />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            className={`${
              editorState?.isAlignLeft
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
            size="icon-sm"
            variant="outline"
          >
            <AlignLeft />
          </Button>
          <Button
            className={`${
              editorState?.isAlignCenter
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
            size="icon-sm"
            variant="outline"
          >
            <AlignCenter />
          </Button>
          <Button
            className={`${
              editorState?.isAlignRight
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
            size="icon-sm"
            variant="outline"
          >
            <AlignRight />
          </Button>
          <Button
            className={`${
              editorState?.isAlignJustify
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            onClick={() =>
              editor?.chain().focus().setTextAlign("justify").run()
            }
            size="icon-sm"
            variant="outline"
          >
            <AlignJustify />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            className={`${
              editorState?.isCodeBlock
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            size="icon-sm"
            variant="outline"
          >
            <SquareCode />
          </Button>
          <Button
            className={`font-serif text-5xl ${
              editorState?.isBlockquote
                ? "bg-accent text-accent-foreground dark:bg-input/50"
                : ""
            }`}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            size="icon-sm"
            variant="outline"
          >
            <span className="flex h-full flex-col items-end rounded-full pt-1.5 font-serif text-[2.1rem]">
              ”
            </span>
          </Button>
        </ButtonGroup>
        {editorState?.isCodeBlock ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  className="flex min-w-24 items-center justify-between text-muted-foreground"
                  size="sm"
                  variant="outline"
                >
                  {capitalize(currentLanguage)}
                  <ChevronDown />
                </Button>
              }
            />
            <DropdownMenuContent className="max-h-60 overflow-y-auto border bg-popover">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => {
                    const language = lang === "auto" ? "" : lang
                    editor
                      ?.chain()
                      .focus()
                      .updateAttributes("codeBlock", { language })
                      .run()
                  }}
                >
                  {capitalize(lang)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <div className="relative h-full min-h-96 w-full flex-1 p-4 px-8">
        <EditorContent
          className={cn(
            "prose xl:prose-lg prose-neutral dark:prose-invert prose-h2:my-4 prose-p:mt-0 prose-p:mb-0 h-full min-h-96 w-full min-w-full flex-1 text-pretty prose:font-sans prose-h1:text-orange-300 prose-h2:text-red-300 prose-h3:text-cyan-200 prose-headings:tracking-wide tracking-normal",
            "prose-headings:font-normal",
            "prose-hr:my-4 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
            "prose-strong:font-semibold prose-p:text-foreground",
            "prose-a:font-normal prose-a:underline prose-a:decoration-primary",
            "prose-pre:overflow-x-auto prose-pre:rounded prose-pre:border prose-pre:bg-muted prose-pre:font-mono dark:prose-pre:bg-muted/25",
            "prose-code:rounded prose-code:bg-muted prose-code:p-1 prose-code:font-normal prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-muted/90",
            "whitespace-pre-wrap prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:text-foreground prose-blockquote:not-italic",
            "[&_.ProseMirror]:focus:outline-none [&_.Prosemirror>*]:my-0",
            "[&_.ProseMirror_code]:font-mono [&_.ProseMirror_pre>code]:bg-transparent"
          )}
          editor={editor}
          spellCheck={false}
        />
        {update ? <Loader className="absolute right-4 bottom-4" /> : null}
      </div>
    </div>
  )
}

export { RichTextEditor }

"use client"

import type { Editor } from "@tiptap/react"
import { useEditorState } from "@tiptap/react"
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
  QuoteIcon,
  Redo,
  SquareCode,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react"
import type { ComponentType } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { LANGUAGES } from "@/modules/pages/components/rich-text-editor/editor-extensions"

const ACTIVE_CLASS = "bg-accent text-accent-foreground dark:bg-input/50"

type ToolbarGroupProps = {
  editor: Editor | null
}

type ToolbarButtonProps = {
  icon: ComponentType
  isActive?: boolean
  disabled?: boolean
  onClick: () => void
}

function ToolbarButton({
  icon: Icon,
  isActive,
  disabled,
  onClick,
}: ToolbarButtonProps) {
  return (
    <Button
      className={isActive ? ACTIVE_CLASS : ""}
      disabled={disabled}
      onClick={onClick}
      size="icon-sm"
      variant="outline"
    >
      <Icon />
    </Button>
  )
}

function HistoryGroup({ editor }: ToolbarGroupProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      canUndo: editor?.can().undo() ?? false,
      canRedo: editor?.can().redo() ?? false,
    }),
  })

  return (
    <ButtonGroup>
      <ToolbarButton
        disabled={!state?.canUndo}
        icon={Undo}
        onClick={() => editor?.chain().focus().undo().run()}
      />
      <ToolbarButton
        disabled={!state?.canRedo}
        icon={Redo}
        onClick={() => editor?.chain().focus().redo().run()}
      />
    </ButtonGroup>
  )
}

function HeadingGroup({ editor }: ToolbarGroupProps) {
  const activeHeading = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return "P"
      }
      if (editor.isActive("heading", { level: 1 })) {
        return "H1"
      }
      if (editor.isActive("heading", { level: 2 })) {
        return "H2"
      }
      if (editor.isActive("heading", { level: 3 })) {
        return "H3"
      }
      return "P"
    },
  })

  const headings = [
    { label: "Heading 1", level: 1 as const },
    { label: "Heading 2", level: 2 as const },
    { label: "Heading 3", level: 3 as const },
  ]

  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              className="flex min-w-16 items-center justify-between text-muted-foreground"
              size="sm"
              variant="outline"
            >
              {activeHeading}
              <ChevronDown />
            </Button>
          }
        />
        <DropdownMenuContent>
          {headings.map(({ label, level }) => (
            <DropdownMenuItem
              key={level}
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level }).run()
              }
            >
              {label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            onClick={() => editor?.chain().focus().setParagraph().run()}
          >
            Paragraph
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

function ListGroup({ editor }: ToolbarGroupProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBulletList: editor?.isActive("bulletList") ?? false,
      isOrderedList: editor?.isActive("orderedList") ?? false,
    }),
  })

  return (
    <ButtonGroup>
      <ToolbarButton
        icon={List}
        isActive={state?.isBulletList}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon={ListOrdered}
        isActive={state?.isOrderedList}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      />
    </ButtonGroup>
  )
}

function FormatGroup({ editor }: ToolbarGroupProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isBold: editor?.isActive("bold") ?? false,
      canBold: editor?.can().toggleBold() ?? false,
      isItalic: editor?.isActive("italic") ?? false,
      canItalic: editor?.can().toggleItalic() ?? false,
      isStrike: editor?.isActive("strike") ?? false,
      canStrike: editor?.can().toggleStrike() ?? false,
      isCode: editor?.isActive("code") ?? false,
      canCode: editor?.can().toggleCode() ?? false,
      isUnderline: editor?.isActive("underline") ?? false,
      canUnderline: editor?.can().toggleUnderline() ?? false,
    }),
  })

  return (
    <ButtonGroup>
      <ToolbarButton
        disabled={!state?.canBold}
        icon={Bold}
        isActive={state?.isBold}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        disabled={!state?.canItalic}
        icon={Italic}
        isActive={state?.isItalic}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        disabled={!state?.canStrike}
        icon={Strikethrough}
        isActive={state?.isStrike}
        onClick={() => editor?.chain().focus().toggleStrike().run()}
      />
      <ToolbarButton
        disabled={!state?.canCode}
        icon={Code}
        isActive={state?.isCode}
        onClick={() => editor?.chain().focus().toggleCode().run()}
      />
      <ToolbarButton
        disabled={!state?.canUnderline}
        icon={UnderlineIcon}
        isActive={state?.isUnderline}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      />
    </ButtonGroup>
  )
}

function LinkGroup({ editor }: ToolbarGroupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState("")

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isLink: editor?.isActive("link") ?? false,
      isSuperscript: editor?.isActive("superscript") ?? false,
      canSuperscript: editor?.can().toggleSuperscript() ?? false,
      isSubscript: editor?.isActive("subscript") ?? false,
      canSubscript: editor?.can().toggleSubscript() ?? false,
    }),
  })

  const handleSaveLink = () => {
    if (!editor) {
      return
    }
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run()
    }
    setIsOpen(false)
  }

  return (
    <ButtonGroup>
      <DropdownMenu
        onOpenChange={(open) => {
          setIsOpen(open)
          if (open && editor) {
            setUrl(editor.getAttributes("link").href || "")
          }
        }}
        open={isOpen}
      >
        <DropdownMenuTrigger
          render={
            <Button
              className={state?.isLink ? ACTIVE_CLASS : ""}
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
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            value={url}
          />
          <div className="flex justify-end gap-2 py-2">
            <Button
              onClick={() => setIsOpen(false)}
              size="sm"
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveLink} size="sm" variant="secondary">
              Save
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <ToolbarButton
        disabled={!state?.canSuperscript}
        icon={SuperscriptIcon}
        isActive={state?.isSuperscript}
        onClick={() => editor?.chain().focus().toggleSuperscript().run()}
      />
      <ToolbarButton
        disabled={!state?.canSubscript}
        icon={SubscriptIcon}
        isActive={state?.isSubscript}
        onClick={() => editor?.chain().focus().toggleSubscript().run()}
      />
    </ButtonGroup>
  )
}

function AlignGroup({ editor }: ToolbarGroupProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isLeft: editor?.isActive({ textAlign: "left" }) ?? false,
      isCenter: editor?.isActive({ textAlign: "center" }) ?? false,
      isRight: editor?.isActive({ textAlign: "right" }) ?? false,
      isJustify: editor?.isActive({ textAlign: "justify" }) ?? false,
    }),
  })

  const alignments = [
    { icon: AlignLeft, value: "left" as const, isActive: state?.isLeft },
    {
      icon: AlignCenter,
      value: "center" as const,
      isActive: state?.isCenter,
    },
    { icon: AlignRight, value: "right" as const, isActive: state?.isRight },
    {
      icon: AlignJustify,
      value: "justify" as const,
      isActive: state?.isJustify,
    },
  ]

  return (
    <ButtonGroup>
      {alignments.map(({ icon, value, isActive }) => (
        <ToolbarButton
          icon={icon}
          isActive={isActive}
          key={value}
          onClick={() => editor?.chain().focus().setTextAlign(value).run()}
        />
      ))}
    </ButtonGroup>
  )
}

function BlockGroup({ editor }: ToolbarGroupProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isCodeBlock: editor?.isActive("codeBlock") ?? false,
      isBlockquote: editor?.isActive("blockquote") ?? false,
    }),
  })

  return (
    <ButtonGroup>
      <ToolbarButton
        icon={SquareCode}
        isActive={state?.isCodeBlock}
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
      />
      <Button
        className={state?.isBlockquote ? ACTIVE_CLASS : ""}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        size="icon-sm"
        variant="outline"
      >
        <QuoteIcon className="size-3.5 fill-current stroke-none" />
      </Button>
    </ButtonGroup>
  )
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function LanguageSelector({ editor }: ToolbarGroupProps) {
  const isCodeBlock = useEditorState({
    editor,
    selector: ({ editor }) => editor?.isActive("codeBlock") ?? false,
  })

  if (!isCodeBlock) {
    return null
  }

  const currentLanguage = editor?.getAttributes("codeBlock").language || "auto"

  return (
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
        {LANGUAGES.map((lang) => (
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
  )
}

export function EditorToolbar({ editor }: ToolbarGroupProps) {
  return (
    <div className="flex items-center gap-x-2 border-b bg-card p-2 text-muted-foreground">
      <HistoryGroup editor={editor} />
      <HeadingGroup editor={editor} />
      <ListGroup editor={editor} />
      <FormatGroup editor={editor} />
      <LinkGroup editor={editor} />
      <AlignGroup editor={editor} />
      <BlockGroup editor={editor} />
      <LanguageSelector editor={editor} />
    </div>
  )
}

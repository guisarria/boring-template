import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import LinkExtension from "@tiptap/extension-link"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import StarterKit from "@tiptap/starter-kit"
import { all, createLowlight } from "lowlight"

const lowlight = createLowlight(all)

export const LANGUAGES = [
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
	"yaml",
] as const

export const extensions = [
	Underline,
	CodeBlockLowlight.configure({ lowlight, enableTabIndentation: true }),
	Subscript.configure({ HTMLAttributes: { class: "subscript" } }),
	Superscript.configure({ HTMLAttributes: { class: "superscript" } }),
	StarterKit.configure({
		codeBlock: false,
		link: false,
		underline: false,
	}),
	LinkExtension.configure({
		openOnClick: "whenNotEditable",
		defaultProtocol: "https",
	}),
	TextAlign.configure({
		types: ["heading", "paragraph"],
		alignments: ["left", "center", "right", "justify"],
		defaultAlignment: "left",
	}),
]

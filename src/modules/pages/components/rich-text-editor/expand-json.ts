import type { Schema } from "@tiptap/pm/model"
import type { JSONContent } from "@tiptap/react"

function getDefaultAttrs(
  spec: Record<string, { default?: unknown }>,
): Record<string, unknown> {
  const defaultAttrs: Record<string, unknown> = {}
  for (const [key, attr] of Object.entries(spec)) {
    if (attr.default !== undefined) {
      defaultAttrs[key] = attr.default
    }
  }
  return defaultAttrs
}

export function expandJSON(schema: Schema, json: JSONContent): JSONContent {
  function addDefaults(item: JSONContent, isMark = false): JSONContent {
    if (!item.type) {
      return item
    }

    const schemaItems = isMark ? schema.marks : schema.nodes
    const itemType = schemaItems[item.type]

    const next: JSONContent = { ...item }

    if (itemType?.spec.attrs) {
      const mergedAttrs = {
        ...getDefaultAttrs(itemType.spec.attrs),
        ...(item.attrs ?? {}),
      }
      next.attrs = Object.keys(mergedAttrs).length ? mergedAttrs : undefined
    }

    if (!isMark && item.content) {
      next.content = item.content.map((child) => addDefaults(child))
    }

    if (item.marks) {
      next.marks = item.marks.map((mark) =>
        addDefaults(mark as JSONContent, true),
      ) as NonNullable<JSONContent["marks"]>
    }

    return next
  }

  return addDefaults(json)
}

import { Link } from '@mantine/tiptap'
import { Placeholder } from '@tiptap/extensions'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useMemo } from 'react'

// Module level, so every render passes the same extensions and the editor is not
// recreated. tiptap 3 StarterKit bundles Link; use the Mantine Link instead.
const baseExtensions = [StarterKit.configure({ link: false }), Link]

export function useRichTextEditor(content = '', placeholder?: string) {
  const extensions = useMemo(
    () =>
      placeholder
        ? [...baseExtensions, Placeholder.configure({ placeholder })]
        : baseExtensions,
    [placeholder]
  )

  return useEditor({ extensions, content })
}

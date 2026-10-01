import { Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// Module level, so every render passes the same extensions and the editor is not
// recreated. tiptap 3 StarterKit bundles Link; use the Mantine Link instead.
const extensions = [StarterKit.configure({ link: false }), Link]

export function useRichTextEditor(content = '') {
  return useEditor({ extensions, content })
}

import { RichTextEditor as BaseEditor } from '@mantine/tiptap'
import { Editor } from '@tiptap/react'

interface RichTextEditorProps {
  editor: Editor | null
}
export const RichTextEditor: React.FC<RichTextEditorProps> = ({ editor }) => {
  return (
    <BaseEditor
      editor={editor}
      id="description"
      style={{ backgroundColor: 'white' }}
    >
      <BaseEditor.Toolbar sticky stickyOffset={60}>
        <BaseEditor.ControlsGroup>
          <BaseEditor.Bold />
          <BaseEditor.Italic />
          <BaseEditor.Underline />
          <BaseEditor.Strikethrough />
          <BaseEditor.ClearFormatting />
        </BaseEditor.ControlsGroup>

        <BaseEditor.ControlsGroup>
          <BaseEditor.H1 />
          <BaseEditor.H2 />
          <BaseEditor.H3 />
          <BaseEditor.H4 />
        </BaseEditor.ControlsGroup>

        <BaseEditor.ControlsGroup>
          <BaseEditor.Blockquote />
          <BaseEditor.Hr />
        </BaseEditor.ControlsGroup>

        <BaseEditor.ControlsGroup>
          <BaseEditor.Link />
          <BaseEditor.Unlink />
        </BaseEditor.ControlsGroup>
      </BaseEditor.Toolbar>

      <BaseEditor.Content />
    </BaseEditor>
  )
}

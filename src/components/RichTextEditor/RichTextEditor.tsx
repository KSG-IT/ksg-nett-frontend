import { RichTextEditor as BaseEditor } from '@mantine/tiptap'
import { Editor } from '@tiptap/react'
import classes from './RichTextEditor.module.css'

interface RichTextEditorProps {
  editor: Editor | null
  id?: string
  // full: for documents. compact: for short notes, without headings and quotes.
  variant?: 'full' | 'compact'
}
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  editor,
  id,
  variant = 'full',
}) => {
  const full = variant === 'full'

  return (
    <BaseEditor
      editor={editor}
      id={id}
      classNames={{ content: classes.content }}
      style={{ backgroundColor: 'white' }}
    >
      <BaseEditor.Toolbar sticky stickyOffset={60}>
        <BaseEditor.ControlsGroup>
          <BaseEditor.Undo />
          <BaseEditor.Redo />
        </BaseEditor.ControlsGroup>

        <BaseEditor.ControlsGroup>
          <BaseEditor.Bold />
          <BaseEditor.Italic />
          <BaseEditor.Underline />
          {full && <BaseEditor.Strikethrough />}
          <BaseEditor.ClearFormatting />
        </BaseEditor.ControlsGroup>

        {full && (
          <BaseEditor.ControlsGroup>
            <BaseEditor.H1 />
            <BaseEditor.H2 />
            <BaseEditor.H3 />
            <BaseEditor.H4 />
          </BaseEditor.ControlsGroup>
        )}

        <BaseEditor.ControlsGroup>
          <BaseEditor.BulletList />
          <BaseEditor.OrderedList />
        </BaseEditor.ControlsGroup>

        {full && (
          <BaseEditor.ControlsGroup>
            <BaseEditor.Blockquote />
            <BaseEditor.Code />
            <BaseEditor.Hr />
          </BaseEditor.ControlsGroup>
        )}

        <BaseEditor.ControlsGroup>
          <BaseEditor.Link />
          <BaseEditor.Unlink />
        </BaseEditor.ControlsGroup>
      </BaseEditor.Toolbar>

      <BaseEditor.Content />
    </BaseEditor>
  )
}

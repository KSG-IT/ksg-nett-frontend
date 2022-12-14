import { Button, FileInput, Stack, TextInput } from '@mantine/core'
import { Link, RichTextEditor } from '@mantine/tiptap'
import { IconFileCode } from '@tabler/icons'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { InternalGroupNode } from 'modules/organization/types'
import { useState } from 'react'

import { showNotification } from '@mantine/notifications'
import { useInternalGroupMutations } from 'modules/organization/mutations.hooks'
import { INTERNAL_GROUP_QUERY } from 'modules/organization/queries'

interface InternalGroupEditFormProps {
  internalGroup: InternalGroupNode
}

export const InternalGroupEditForm: React.FC<InternalGroupEditFormProps> = ({
  internalGroup,
}) => {
  const [name, setName] = useState(internalGroup.name)
  const [image, setImage] = useState<File | null>(null)
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: internalGroup.description,
  })

  const { patchInternalGroup, patchInternalGroupLoading } =
    useInternalGroupMutations()

  function handleSave() {
    if (!editor) return

    if (name === '') return

    patchInternalGroup({
      variables: {
        id: internalGroup.id,
        input: {
          name,
          description: editor.getHTML(),
          groupImage: image,
        },
      },
      refetchQueries: [INTERNAL_GROUP_QUERY],
      onCompleted() {
        showNotification({
          title: 'Informasjon oppdatert',
          message: 'Informasjonen om gruppen er oppdatert',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  return (
    <Stack>
      <TextInput
        label="Navn på gjengen"
        value={name}
        onChange={e => setName(e.currentTarget.value)}
      />
      <label htmlFor="description">Beskrivelse av gjengen</label>
      <RichTextEditor editor={editor} id="description">
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>

      <FileInput
        value={image}
        onChange={setImage}
        label="Velg bildefil"
        accept="image/png,image/jpeg,image/jpg"
        placeholder="Trykk her"
        icon={<IconFileCode />}
        clearable
      />

      <Button disabled={patchInternalGroupLoading} onClick={handleSave}>
        Lagre
      </Button>
    </Stack>
  )
}

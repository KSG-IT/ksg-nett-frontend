import { Button, FileInput, Stack, TextInput } from '@mantine/core'
import { Link } from '@mantine/tiptap'
import { IconCheck, IconFileCode } from '@tabler/icons'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { InternalGroupNode } from 'modules/organization/types'
import { useState } from 'react'

import { showNotification } from '@mantine/notifications'
import { RichTextEditor } from 'components/RichTextEditor'
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
          icon: <IconCheck />,
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
      <RichTextEditor editor={editor} />

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

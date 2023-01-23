import { Button, Group, Stack, TextInput } from '@mantine/core'
import { DocumentNode } from '../../types.graphql'
import { RichTextEditor } from 'components/RichTextEditor'
import { useDocumentFormAPI } from './useDocumentFormAPI'
import { useDocumentLogic } from './useDocumentLogic'
import { PermissionGate } from 'components/PermissionGate'
import { PERMISSIONS } from 'util/permissions'

interface DocumentForm {
  document?: DocumentNode
  onCompletedCallback: () => void
  editCallback?: () => void
}

export const DocumentForm: React.FC<DocumentForm> = ({
  document,
  onCompletedCallback,
  editCallback,
}) => {
  const { form, editor, onSubmit } = useDocumentLogic({
    ...useDocumentFormAPI(document, onCompletedCallback),
  })

  const { formState, register, handleSubmit } = form
  const { errors, isSubmitting } = formState

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Group position={'apart'}>
          <TextInput
            size={'md'}
            placeholder="Navn"
            required
            error={errors.name?.message}
            {...register('name')}
          />
          {document && (
            <PermissionGate permissions={PERMISSIONS.handbook.change.document}>
              <Button variant={'light'} onClick={editCallback}>
                Avbryt
              </Button>
            </PermissionGate>
          )}
        </Group>

        <RichTextEditor editor={editor} />
        <Button disabled={isSubmitting} type="submit">
          {document ? 'Lagre' : 'Opprett'}
        </Button>
      </Stack>
    </form>
  )
}

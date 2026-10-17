import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { format } from 'util/date-fns'
import { z } from 'zod'
import { useChatMutations } from '../mutations.hooks'
import { MY_CHATS_QUERY } from '../queries'
import { MegaChatPreviewReturns } from '../types.graphql'
import { MegaChatShiftList } from './MegaChatShiftList'

// Matches MAX_CHAT_NAME_LENGTH in the backend
const megaChatSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Gi chatten et navn')
    .max(128, 'Navnet kan ha høyst 128 tegn'),
})

type MegaChatForm = z.infer<typeof megaChatSchema>

interface NewMegaChatModalProps {
  opened: boolean
  onClose: () => void
  preview: MegaChatPreviewReturns['megaChatPreview']
}

// "Fredag megachat" on a Friday
function defaultName(): string {
  const weekday = format(new Date(), 'EEEE')
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} megachat`
}

// Everyone on duty now becomes a member, and the creator too.
export const NewMegaChatModal: React.FC<NewMegaChatModalProps> = ({
  opened,
  onClose,
  preview,
}) => {
  const navigate = useNavigate()
  const { createMegaChat, createMegaChatLoading } = useChatMutations()
  const { register, handleSubmit, formState, reset } = useForm<MegaChatForm>({
    resolver: zodResolver(megaChatSchema),
    defaultValues: { name: defaultName() },
  })

  function handleClose() {
    reset()
    onClose()
  }

  function handleCreate({ name }: MegaChatForm) {
    createMegaChat({
      variables: { name },
      refetchQueries: [MY_CHATS_QUERY],
      onCompleted({ createMegaChat }) {
        handleClose()
        navigate(`/chat/${createMegaChat.chat.id}`)
      },
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message, color: 'red' })
      },
    })
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size="lg"
      title={
        <div>
          <Text fw={800} size="xl">
            Ny megachat
          </Text>
          <Text size="sm" c="dimmed">
            Alle som er på vakt nå blir med. Du kan legge til flere etterpå.
          </Text>
        </div>
      }
    >
      <form onSubmit={handleSubmit(handleCreate)}>
        <Stack gap="lg">
          <TextInput
            label="Navn på chatten"
            data-autofocus
            error={formState.errors.name?.message}
            {...register('name')}
          />
          <Stack gap={6}>
            <Group justify="space-between" align="baseline">
              <Text size="sm" fw={600}>
                På vakt nå
              </Text>
              <Text size="sm" c="dimmed">
                {preview.userCount} personer på {preview.shifts.length} vakter
              </Text>
            </Group>
            <MegaChatShiftList shifts={preview.shifts} />
          </Stack>
          <Text size="sm" c="dimmed">
            Megachatter kan opprettes fredag og lørdag etter kl. 18:00. Chatten
            stenger 2 timer etter at siste vakt er slutt.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={handleClose}>
              Avbryt
            </Button>
            <Button
              type="submit"
              loading={createMegaChatLoading}
              disabled={preview.userCount === 0}
            >
              Opprett chat
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

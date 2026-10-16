import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Textarea } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useChatMutations } from '../mutations.hooks'

const MAX_LENGTH = 2000

const messageSchema = z.object({
  body: z.string().trim().min(1).max(MAX_LENGTH),
})
type MessageForm = z.infer<typeof messageSchema>

interface MessageComposerProps {
  chatId: string
  onSent: () => void
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  chatId,
  onSent,
}) => {
  const { sendChatMessage, sendChatMessageLoading } = useChatMutations()
  const { register, handleSubmit, reset, formState } = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: { body: '' },
  })

  async function handleSend({ body }: MessageForm) {
    try {
      await sendChatMessage({ variables: { chatId, body } })
      reset()
      onSent()
    } catch (error) {
      showNotification({
        title: 'Kunne ikke sende meldingen',
        message: error instanceof Error ? error.message : '',
        color: 'red',
      })
    }
  }

  // Enter sends, and Shift+Enter makes a new line. Enter during text
  // composition (an IME) confirms the text and does not send.
  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key !== 'Enter' || event.shiftKey) return
    if (event.nativeEvent.isComposing) return
    event.preventDefault()
    if (sendChatMessageLoading) return
    handleSubmit(handleSend)()
  }

  return (
    <form onSubmit={handleSubmit(handleSend)}>
      <Group align="flex-end" wrap="nowrap" p="md" gap="sm">
        <Textarea
          {...register('body')}
          aria-label="Skriv en melding"
          placeholder="Skriv en melding"
          autosize
          minRows={1}
          maxRows={5}
          style={{ flex: 1 }}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="submit"
          color="samfundet-red"
          loading={sendChatMessageLoading}
          disabled={!formState.isValid}
        >
          Send
        </Button>
      </Group>
    </form>
  )
}

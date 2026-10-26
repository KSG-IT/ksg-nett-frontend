import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Textarea } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const MAX_LENGTH = 2000

const messageSchema = z.object({
  body: z.string().trim().min(1).max(MAX_LENGTH),
})
type MessageForm = z.infer<typeof messageSchema>

interface MessageComposerProps {
  onSend: (body: string) => Promise<void>
}

// The field clears at once, and the message shows as pending. More messages
// can follow before the first is saved. A failed send puts the text back.
export const MessageComposer: React.FC<MessageComposerProps> = ({ onSend }) => {
  const { register, handleSubmit, reset, setValue, formState } =
    useForm<MessageForm>({
      resolver: zodResolver(messageSchema),
      defaultValues: { body: '' },
    })

  async function handleSend({ body }: MessageForm) {
    reset()
    try {
      await onSend(body)
    } catch (error) {
      setValue('body', body, { shouldValidate: true })
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
          disabled={!formState.isValid}
        >
          Send
        </Button>
      </Group>
    </form>
  )
}

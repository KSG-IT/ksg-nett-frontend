import { useMutation } from '@apollo/client'
import {
  Button,
  Checkbox,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useState } from 'react'
import { useMe } from 'util/hooks'
import { SEND_FEEDBACK_MUTATION } from '../../mutations'

// The backend checks the same limit (common.schema.SendFeedbackMutation).
export const FEEDBACK_MAX_LENGTH = 500
export const FEEDBACK_EMAIL = 'ksg-it@samfundet.no'

interface FeedbackModalProps {
  opened: boolean
  onClose: () => void
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  opened,
  onClose,
}) => {
  const me = useMe()
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [send, { loading }] = useMutation(SEND_FEEDBACK_MUTATION)
  const empty = message.trim() === ''

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    send({
      variables: { message: message.trim(), anonymous },
      onCompleted() {
        showNotification({
          title: 'Takk!',
          message: 'Tilbakemeldingen er sendt til KSG-IT.',
        })
        setMessage('')
        setAnonymous(false)
        onClose()
      },
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message, color: 'red' })
      },
    })
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Gi tilbakemelding" centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <Text size="sm">
            Ris, ros eller en idé til KSG-nett? Tilbakemeldingen sendes som
            e-post til <b>{FEEDBACK_EMAIL}</b>.
          </Text>
          <Textarea
            label="Tilbakemelding"
            value={message}
            onChange={event => setMessage(event.currentTarget.value)}
            maxLength={FEEDBACK_MAX_LENGTH}
            autosize
            minRows={4}
            maxRows={10}
            data-autofocus
            description={`${message.length}/${FEEDBACK_MAX_LENGTH} tegn`}
            inputWrapperOrder={['label', 'input', 'description']}
          />
          <Checkbox
            label="Send anonymt"
            checked={anonymous}
            onChange={event => setAnonymous(event.currentTarget.checked)}
          />
          <SenderNote
            anonymous={anonymous}
            name={me.getCleanFullName}
            email={me.email}
          />
          <Group justify="flex-end" gap="xs">
            <Button variant="subtle" color="gray" onClick={onClose}>
              Avbryt
            </Button>
            <Button
              type="submit"
              color="samfundet-red"
              loading={loading}
              disabled={empty}
            >
              Send
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

interface SenderNoteProps {
  anonymous: boolean
  name: string
  email: string
}

const SenderNote: React.FC<SenderNoteProps> = ({ anonymous, name, email }) =>
  anonymous ? (
    <Text size="xs" c="dimmed">
      Navnet og e-postadressen din sendes ikke med i e-posten, så KSG-IT kan
      ikke svare deg. Serverloggene viser fortsatt hvem som sendte.
    </Text>
  ) : (
    <Text size="xs" c="dimmed">
      Sendes med navnet ditt (<b>{name}</b>) og e-postadressen din (
      <b>{email}</b>), så KSG-IT kan svare deg.
    </Text>
  )

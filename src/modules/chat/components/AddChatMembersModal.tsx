import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useState } from 'react'
import { UserOption } from 'util/user'
import { useChatMutations } from '../mutations.hooks'
import { CHAT_QUERY } from '../queries'
import { ChatDetail } from '../types.graphql'
import { ChatUserPicker } from './ChatUserPicker'

interface AddChatMembersModalProps {
  opened: boolean
  onClose: () => void
  chat: ChatDetail
}

export const AddChatMembersModal: React.FC<AddChatMembersModalProps> = ({
  opened,
  onClose,
  chat,
}) => {
  const [picked, setPicked] = useState<UserOption[]>([])
  const { addChatMembers, addChatMembersLoading } = useChatMutations()

  function handleClose() {
    setPicked([])
    onClose()
  }

  function handleAdd() {
    addChatMembers({
      variables: { chatId: chat.id, userIds: picked.map(user => user.value) },
      refetchQueries: [{ query: CHAT_QUERY, variables: { chatId: chat.id } }],
      onCompleted({ addChatMembers }) {
        showNotification({
          title: 'Lagt til',
          message: `${addChatMembers.addedCount} lagt til i ${chat.name}`,
          color: 'green',
        })
        handleClose()
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
      title={
        <div>
          <Text fw={800} size="xl">
            Legg til i chat
          </Text>
          <Text size="sm" c="dimmed">
            {chat.name} · {chat.members.length} medlemmer
          </Text>
        </div>
      }
    >
      <Stack gap="lg">
        <ChatUserPicker
          picked={picked}
          onChange={setPicked}
          members={chat.members}
        />
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {picked.length} valgt
          </Text>
          <Group>
            <Button variant="default" onClick={handleClose}>
              Avbryt
            </Button>
            <Button
              onClick={handleAdd}
              loading={addChatMembersLoading}
              disabled={picked.length === 0}
            >
              Legg til
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  )
}

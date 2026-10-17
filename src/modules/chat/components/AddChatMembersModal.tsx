import { useQuery } from '@apollo/client'
import { Button, Group, Modal, MultiSelect, Stack, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconSearch } from '@tabler/icons-react'
import { ALL_ACTIVE_USERS_LIST_QUERY } from 'modules/users/queries'
import {
  AllUsersShallowQueryReturns,
  AllUsersShallowQueryVariables,
} from 'modules/users/types'
import { useState } from 'react'
import { usersToSelectOption } from 'util/user'
import { useChatMutations } from '../mutations.hooks'
import { CHAT_QUERY } from '../queries'
import { ChatDetail } from '../types.graphql'
import { memberAwareOptions } from '../util'

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
  const [userIds, setUserIds] = useState<string[]>([])
  const { addChatMembers, addChatMembersLoading } = useChatMutations()
  const { data } = useQuery<
    AllUsersShallowQueryReturns,
    AllUsersShallowQueryVariables
  >(ALL_ACTIVE_USERS_LIST_QUERY, { variables: { q: '' }, skip: !opened })

  const options = memberAwareOptions(
    usersToSelectOption(data?.allActiveUsersList),
    chat.members
  )

  function handleClose() {
    setUserIds([])
    onClose()
  }

  function handleAdd() {
    addChatMembers({
      variables: { chatId: chat.id, userIds },
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
        <MultiSelect
          data-autofocus
          aria-label="Søk etter bruker"
          placeholder="Søk etter bruker"
          leftSection={<IconSearch size={18} />}
          data={options}
          value={userIds}
          onChange={setUserIds}
          searchable
          clearable
          limit={30}
          nothingFoundMessage="Ingen brukere funnet"
          comboboxProps={{ withinPortal: true }}
        />
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {userIds.length} valgt
          </Text>
          <Group>
            <Button variant="default" onClick={handleClose}>
              Avbryt
            </Button>
            <Button
              onClick={handleAdd}
              loading={addChatMembersLoading}
              disabled={userIds.length === 0}
            >
              Legg til
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  )
}

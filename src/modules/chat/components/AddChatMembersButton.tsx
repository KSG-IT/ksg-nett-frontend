import { ActionIcon, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconUserPlus } from '@tabler/icons-react'
import { useMe } from 'util/hooks'
import { usePermissions } from 'util/hooks/usePermissions'
import { PERMISSIONS } from 'util/permissions'
import { ChatDetail } from '../types.graphql'
import { AddChatMembersModal } from './AddChatMembersModal'

interface AddChatMembersButtonProps {
  chat: ChatDetail
}

// Only a mega chat takes new members, only while it is open, and only from a
// member with chat.add_to_mega_chat. The server checks the same.
export const AddChatMembersButton: React.FC<AddChatMembersButtonProps> = ({
  chat,
}) => {
  const me = useMe()
  const { hasPermissions } = usePermissions()
  const [opened, { open, close }] = useDisclosure(false)

  const isMember = chat.members.some(member => member.user.id === me.id)
  const canAdd =
    chat.membersEditable &&
    !chat.closed &&
    isMember &&
    hasPermissions(PERMISSIONS.chat.addToMegaChat)
  if (!canAdd) return null

  return (
    <>
      <Tooltip label="Legg til i chat">
        <ActionIcon
          variant="subtle"
          color="dark"
          size={44}
          aria-label="Legg til i chat"
          onClick={open}
        >
          <IconUserPlus size={24} />
        </ActionIcon>
      </Tooltip>
      <AddChatMembersModal opened={opened} onClose={close} chat={chat} />
    </>
  )
}

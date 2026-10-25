import { ActionIcon, Tooltip } from '@mantine/core'
import { IconBell, IconBellOff } from '@tabler/icons-react'
import { usePushEnabled } from 'modules/push'
import { useMe } from 'util/hooks'
import { useChatMutations } from '../mutations.hooks'
import { ChatDetail } from '../types.graphql'

interface ChatMuteButtonProps {
  chat: ChatDetail
}

// A muted chat sends the member no message pushes. Being added to a chat still
// sends one. Only members can mute, and only with push on.
export const ChatMuteButton: React.FC<ChatMuteButtonProps> = ({ chat }) => {
  const me = useMe()
  const { enabled } = usePushEnabled()
  const { setChatMuted } = useChatMutations()

  const isMember = chat.members.some(member => member.user.id === me.id)
  if (!enabled || !isMember) return null

  const label = chat.muted
    ? 'Slå på varsler for denne chatten'
    : 'Slå av varsler for denne chatten'

  function handleToggle() {
    const muted = !chat.muted
    setChatMuted({
      variables: { chatId: chat.id, muted },
      optimisticResponse: {
        setChatMuted: {
          chat: { __typename: 'ChatNode', id: chat.id, muted },
        },
      },
    })
  }

  return (
    <Tooltip label={label}>
      <ActionIcon
        variant="subtle"
        color="dark"
        size={44}
        aria-label={label}
        aria-pressed={chat.muted}
        onClick={handleToggle}
      >
        {chat.muted ? <IconBellOff size={22} /> : <IconBell size={22} />}
      </ActionIcon>
    </Tooltip>
  )
}

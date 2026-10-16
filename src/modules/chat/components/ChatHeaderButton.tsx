import { ActionIcon, Indicator } from '@mantine/core'
import { IconMessages } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useChatEnabled } from '../hooks/useChatEnabled'
import { useUnreadChatCount } from '../hooks/useUnreadChatCount'

// On a phone the sidebar is collapsed, so the chat gets a button in the top bar
// next to the search field, at the right edge.
export const ChatHeaderButton: React.FC = () => {
  const enabled = useChatEnabled()
  if (!enabled) return null
  return <ChatHeaderLink />
}

const ChatHeaderLink: React.FC = () => {
  const unread = useUnreadChatCount()

  return (
    <Indicator
      label={unread > 99 ? '99+' : unread}
      disabled={unread === 0}
      color="samfundet-red"
      size={18}
      offset={4}
      withBorder
      ml="auto"
    >
      <ActionIcon
        component={Link}
        to="/chat"
        variant="subtle"
        color="gray"
        size={44}
        aria-label={unread > 0 ? `Chat, ${unread} uleste` : 'Chat'}
      >
        <IconMessages size={24} stroke={1.7} />
      </ActionIcon>
    </Indicator>
  )
}

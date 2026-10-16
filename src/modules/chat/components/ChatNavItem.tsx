import { Text } from '@mantine/core'
import { IconMessages } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'
import classes from 'containers/Navbar.module.css'
import { useSidebar } from 'util/hooks'
import { useChatEnabled } from '../hooks/useChatEnabled'
import { useUnreadChatCount } from '../hooks/useUnreadChatCount'
import { UnreadBadge } from './UnreadBadge'

// The "Chat" row in the "me" section of the sidebar, with the unread count.
export const ChatNavItem: React.FC = () => {
  const { enabled } = useChatEnabled()
  if (!enabled) return null
  return <ChatNavLink />
}

const ChatNavLink: React.FC = () => {
  const unread = useUnreadChatCount()
  const { toggleSidebar } = useSidebar()
  const active = useLocation().pathname.startsWith('/chat')

  return (
    <Link
      to="/chat"
      className={classes.item}
      data-active={active || undefined}
      aria-current={active ? 'page' : undefined}
      onClick={toggleSidebar}
    >
      <IconMessages className={classes.icon} size={18} stroke={1.7} />
      <Text span inherit truncate style={{ flex: 1 }}>
        Chat
      </Text>
      <UnreadBadge count={unread} />
    </Link>
  )
}

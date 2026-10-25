import { Text } from '@mantine/core'
import { IconBellOff } from '@tabler/icons-react'
import { usePushEnabled } from 'modules/push'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { ChatSummary } from '../types.graphql'
import classes from './ChatListItem.module.css'
import { UnreadBadge } from './UnreadBadge'

interface ChatListItemProps {
  chat: ChatSummary
  active: boolean
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ chat, active }) => {
  const { enabled: pushEnabled } = usePushEnabled()
  const { lastMessage } = chat
  const preview = lastMessage
    ? `${lastMessage.sender.firstName}: ${
        lastMessage.hidden ? 'Melding fjernet' : lastMessage.body
      }`
    : 'Ingen meldinger ennå'

  return (
    <Link
      to={`/chat/${chat.id}`}
      className={classes.item}
      data-active={active || undefined}
      aria-current={active ? 'page' : undefined}
    >
      <div className={classes.top}>
        <Text fw={chat.unreadCount > 0 ? 700 : 500} truncate>
          {chat.name}
        </Text>
        {pushEnabled && chat.muted && (
          <IconBellOff
            size={14}
            className={classes.muted}
            aria-label="Varsler er slått av"
          />
        )}
        {lastMessage && (
          <Text size="xs" c="dimmed" className={classes.time}>
            {format(new Date(lastMessage.createdAt), 'HH:mm')}
          </Text>
        )}
      </div>
      <div className={classes.bottom}>
        <Text size="sm" c="dimmed" truncate>
          {preview}
        </Text>
        <UnreadBadge count={chat.unreadCount} />
        {chat.closed && (
          <Text size="xs" c="dimmed" fw={600}>
            Stengt
          </Text>
        )}
      </div>
    </Link>
  )
}

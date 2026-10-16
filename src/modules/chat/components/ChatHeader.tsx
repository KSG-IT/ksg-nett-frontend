import { Avatar, Group, Indicator, Text, Title, Tooltip } from '@mantine/core'
import { format } from 'util/date-fns'
import { ChatDetail } from '../types.graphql'
import { OnlineDot } from './OnlineDot'
import classes from './ChatHeader.module.css'

const SHOWN_MEMBERS = 5

interface ChatHeaderProps {
  chat: ChatDetail
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const shown = chat.members.slice(0, SHOWN_MEMBERS)
  const rest = chat.members.length - shown.length

  return (
    <Group
      justify="space-between"
      wrap="wrap"
      gap="sm"
      className={classes.header}
    >
      <div>
        <Title order={3}>{chat.name}</Title>
        <Group gap={6} wrap="nowrap">
          <OnlineDot online={chat.onlineCount > 0} />
          <Text size="sm" c="dimmed">
            {chat.onlineCount} av {chat.members.length} pålogget ·{' '}
            {chat.closed
              ? 'Stengt'
              : `Åpen til ${format(new Date(chat.closesAt), 'EEE HH:mm')}`}
          </Text>
        </Group>
      </div>
      <Group gap={6} wrap="nowrap">
        {shown.map(member => (
          <Tooltip
            key={member.user.id}
            label={`${member.user.getFullWithNickName}${
              member.online ? ' (pålogget)' : ''
            }`}
          >
            <Indicator
              color="green.8"
              size={10}
              offset={4}
              withBorder
              disabled={!member.online}
            >
              <Avatar
                size="sm"
                src={member.user.profileImage}
                color="samfundet-red"
              >
                {member.user.initials}
              </Avatar>
            </Indicator>
          </Tooltip>
        ))}
        {rest > 0 && <Avatar size="sm">+{rest}</Avatar>}
      </Group>
    </Group>
  )
}

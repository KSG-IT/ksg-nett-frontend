import {
  ActionIcon,
  Avatar,
  Group,
  Indicator,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import { IconChevronLeft } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { ChatDetail, ChatMember } from '../types.graphql'
import { AddChatMembersButton } from './AddChatMembersButton'
import { ChatMembersDrawer } from './ChatMembersDrawer'
import { OnlineDot } from './OnlineDot'
import classes from './ChatHeader.module.css'

interface ChatHeaderProps {
  chat: ChatDetail
}

// On a phone the open chat is full screen, so this header is the only one:
// it has the way back to the list, and a members button instead of avatars.
export const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => (
  <Group wrap="nowrap" gap="sm" className={classes.header}>
    <ActionIcon
      component={Link}
      to="/chat"
      hiddenFrom="sm"
      variant="subtle"
      color="dark"
      size={44}
      ml={-8}
      aria-label="Tilbake til chatter"
    >
      <IconChevronLeft size={24} />
    </ActionIcon>
    <div className={classes.title}>
      <Title order={3} lineClamp={1} className={classes.name}>
        {chat.name}
      </Title>
      <Group gap={6} wrap="nowrap">
        <OnlineDot online={chat.onlineCount > 0} />
        <Text size="sm" c="dimmed" truncate>
          {chat.onlineCount} av {chat.members.length} pålogget ·{' '}
          {chat.closed
            ? 'Stengt'
            : `Åpen til ${format(new Date(chat.closesAt), 'EEE HH:mm')}`}
        </Text>
      </Group>
    </div>
    <Group gap={6} wrap="nowrap" visibleFrom="sm">
      <MemberAvatars members={chat.members} shown={5} />
    </Group>
    <AddChatMembersButton chat={chat} />
    <ChatMembersDrawer members={chat.members} />
  </Group>
)

interface MemberAvatarsProps {
  members: ChatMember[]
  shown: number
}

const MemberAvatars: React.FC<MemberAvatarsProps> = ({ members, shown }) => {
  const rest = members.length - shown

  return (
    <>
      {members.slice(0, shown).map(member => (
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
    </>
  )
}

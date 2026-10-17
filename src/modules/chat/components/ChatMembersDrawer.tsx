import {
  ActionIcon,
  Avatar,
  Drawer,
  Group,
  Indicator,
  Text,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconUsers } from '@tabler/icons-react'
import { ChatMember } from '../types.graphql'

interface ChatMembersDrawerProps {
  members: ChatMember[]
}

// On a phone the header has no room for avatars. A members button opens the
// full list from the bottom, online members first.
export const ChatMembersDrawer: React.FC<ChatMembersDrawerProps> = ({
  members,
}) => {
  const [opened, { open, close }] = useDisclosure(false)
  const onlineFirst = [...members].sort(
    (a, b) => Number(b.online) - Number(a.online)
  )
  const onlineCount = members.filter(member => member.online).length

  return (
    <>
      <ActionIcon
        hiddenFrom="sm"
        variant="subtle"
        color="dark"
        size={44}
        aria-label={`Medlemmer, ${members.length}`}
        onClick={open}
      >
        <IconUsers size={24} />
      </ActionIcon>
      <Drawer
        opened={opened}
        onClose={close}
        position="bottom"
        size="70%"
        radius="lg"
        title={
          <div>
            <Text fw={700} size="lg">
              Medlemmer ({members.length})
            </Text>
            <Text size="sm" c="dimmed">
              {onlineCount} pålogget
            </Text>
          </div>
        }
      >
        {onlineFirst.map(member => (
          <MemberRow key={member.user.id} member={member} />
        ))}
      </Drawer>
    </>
  )
}

interface MemberRowProps {
  member: ChatMember
}

const MemberRow: React.FC<MemberRowProps> = ({ member }) => (
  <Group gap="sm" wrap="nowrap" py={8}>
    <Indicator
      color="green.8"
      size={12}
      offset={5}
      position="bottom-end"
      withBorder
      disabled={!member.online}
    >
      <Avatar src={member.user.profileImage} color="samfundet-red">
        {member.user.initials}
      </Avatar>
    </Indicator>
    <div style={{ minWidth: 0 }}>
      <Text fw={500} truncate>
        {member.user.getFullWithNickName}
      </Text>
      <Text size="xs" c="dimmed">
        {member.online ? 'Pålogget' : 'Ikke pålogget'}
      </Text>
    </div>
  </Group>
)

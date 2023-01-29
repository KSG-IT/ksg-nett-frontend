import { Text, ThemeIcon, Timeline, useMantineTheme } from '@mantine/core'
import { IconUsers } from '@tabler/icons'
import { InternalGroupPositionMembershipNode } from 'modules/organization/types.graphql'

interface UserHistoryProps {
  memberships: InternalGroupPositionMembershipNode[]
}

export const UserHistory: React.FC<UserHistoryProps> = ({ memberships }) => {
  const theme = useMantineTheme()
  const fields = memberships.map(
    ({ id, position, membershipStart, membershipEnd }) => (
      <Timeline.Item
        bulletSize={28}
        bullet={
          <ThemeIcon size={30} variant="filled" radius="xl">
            <IconUsers size={20} />
          </ThemeIcon>
        }
        key={id}
        title={position.name}
      >
        <Text color={'dimmed'} size={'sm'}>
          {position.internalGroup.name}
        </Text>
        <Text size={'sm'} weight={800} color={theme.primaryColor}>
          {membershipStart} {membershipEnd && ` - ${membershipEnd}`}
        </Text>
      </Timeline.Item>
    )
  )

  return <Timeline>{fields}</Timeline>
}

import { Text, ThemeIcon, Timeline, useMantineTheme } from '@mantine/core'
import { IconUsers } from '@tabler/icons-react'
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
          <ThemeIcon
            size={30}
            variant="filled"
            color={'samfundet-red.4'}
            radius="xl"
          >
            <IconUsers size={20} />
          </ThemeIcon>
        }
        key={id}
        title={position.name}
      >
        <Text c={'dimmed'} size={'sm'}>
          {position.internalGroup.name}
        </Text>
        <Text size={'sm'} fw={800} c={`${theme.colors.brand}`}>
          {membershipStart} {membershipEnd && ` - ${membershipEnd}`}
        </Text>
      </Timeline.Item>
    )
  )

  return <Timeline>{fields}</Timeline>
}

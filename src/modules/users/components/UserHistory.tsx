import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Text, ThemeIcon, Timeline } from '@mantine/core'
import { IconUserPlus, IconUsers } from '@tabler/icons'
import { InternalGroupPositionMembershipNode } from '../UserManagement/types'

interface UserHistoryProps {
  memberships: InternalGroupPositionMembershipNode[]
}

export const UserHistory: React.VFC<UserHistoryProps> = ({ memberships }) => {
  const fields = memberships.map(
    ({ id, position, membershipStart, membershipEnd }) => (
      <Timeline.Item
        bulletSize={37}
        bullet={
          <ThemeIcon
            size={35}
            variant="gradient"
            gradient={{ from: 'orange', to: 'gold' }}
            radius="xl"
          >
            <IconUsers size={20} />
          </ThemeIcon>
        }
        key={id}
        title={position.name}
      >
        <Text color={'dimmed'} size={'sm'}>
          {position.internalGroup.name}
        </Text>
        <Text size={'sm'} weight={800} color="goldenrod">
          {membershipStart} {membershipEnd && ` - ${membershipEnd}`}
        </Text>
      </Timeline.Item>
    )
  )

  return <Timeline>{fields}</Timeline>
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Text, ThemeIcon, Timeline } from '@mantine/core'
import { IconUser } from '@tabler/icons'
import { InternalGroupPositionMembershipNode } from '../UserManagement/types'

interface UserHistoryProps {
  memberships: InternalGroupPositionMembershipNode[]
}

export const UserHistory: React.FC<UserHistoryProps> = ({ memberships }) => {
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
            <IconUser />
          </ThemeIcon>
        }
        key={id}
        title={position.name}
      >
        <Text color={'dimmed'} size={'sm'}>
          {position.internalGroup.name}
        </Text>
        <Text size={'sm'}>
          {membershipStart} {membershipEnd && ` - ${membershipEnd}`}
        </Text>
      </Timeline.Item>
    )
  )

  return <Timeline>{fields}</Timeline>
}

import { Card, Group, Title } from '@mantine/core'
import { UserThumbnail } from 'modules/users/components/UserThumbnail'
import { UserNode, UserThumbnailProps } from 'modules/users/types'

export type WantedUser = Pick<UserNode, 'balance' | 'fullName'> &
  UserThumbnailProps['user']

interface WantedListProps {
  users: WantedUser[]
}

export const WantedList: React.FC<WantedListProps> = ({ users }) => {
  return (
    <Card>
      <Title order={3}>Wanted</Title>
      <Group>
        {users.map(user => (
          <Card>
            <UserThumbnail size="sm" user={user} />
            <span>{user.fullName}</span>
            <span>Skylder: {user.balance},- NOK</span>
          </Card>
        ))}
      </Group>
    </Card>
  )
}

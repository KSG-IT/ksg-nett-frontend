import { Card, Group, Title } from '@mantine/core'
import { UserNode, UserThumbnail, UserThumbnailProps } from 'modules/users'

export type WantedUser = Pick<UserNode, 'balance' | 'fullName'> &
  UserThumbnailProps['user']

interface WantedListProps {
  users: WantedUser[]
}

export const WantedList: React.VFC<WantedListProps> = ({ users }) => {
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

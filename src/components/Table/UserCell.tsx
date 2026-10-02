import { Anchor, Avatar, Group, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

// Avatar, linked name and a dimmed second line, as in UsersStack from
// ui.mantine.dev (MIT)

interface UserCellProps {
  userId: string
  name: string
  description?: React.ReactNode
  profileImage?: string | null
}

export const UserCell: React.FC<UserCellProps> = ({
  userId,
  name,
  description,
  profileImage,
}) => (
  <Group gap="sm" wrap="nowrap">
    <Avatar
      src={profileImage}
      name={name}
      color="initials"
      size={32}
      radius="xl"
    />
    <div>
      <Anchor component={Link} to={`/users/${userId}`} fz="sm" fw={500}>
        {name}
      </Anchor>
      {description && (
        <Text fz="xs" c="dimmed">
          {description}
        </Text>
      )}
    </div>
  </Group>
)

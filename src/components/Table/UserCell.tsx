import { Anchor, Avatar, Group, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

// Avatar, linked name and a dimmed second line, as in UsersStack from
// ui.mantine.dev (MIT). Compact puts everything on one line.

interface UserCellProps {
  to: string
  name: string
  description?: React.ReactNode
  profileImage?: string | null
  compact?: boolean
}

export const UserCell: React.FC<UserCellProps> = ({
  to,
  name,
  description,
  profileImage,
  compact = false,
}) => {
  const link = (
    <Anchor component={Link} to={to} fz="inherit" fw={500}>
      {name}
    </Anchor>
  )

  if (compact) {
    return (
      <Group gap={6} wrap="nowrap">
        <Avatar
          src={profileImage}
          name={name}
          color="initials"
          size={20}
          radius="xl"
        />
        {link}
        {description && (
          <Text fz="inherit" c="dimmed" truncate>
            {description}
          </Text>
        )}
      </Group>
    )
  }

  return (
    <Group gap="sm" wrap="nowrap">
      <Avatar
        src={profileImage}
        name={name}
        color="initials"
        size={32}
        radius="xl"
      />
      <div>
        {link}
        {description && (
          <Text fz="xs" c="dimmed">
            {description}
          </Text>
        )}
      </div>
    </Group>
  )
}

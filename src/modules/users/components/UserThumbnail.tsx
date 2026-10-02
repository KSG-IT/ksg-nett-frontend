import { Avatar, Tooltip } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { UserThumbnailProps } from 'modules/users/types'
import { Link } from 'react-router-dom'

export const UserThumbnail: React.FC<UserThumbnailProps> = ({ user, size }) => {
  const { profileImage, initials, getFullWithNickName } = user
  const hasprofileImage = profileImage !== null
  return (
    <Tooltip label={getFullWithNickName} withArrow withinPortal>
      <Avatar
        size={size}
        component={Link}
        color="samfundet-red"
        to={`/users/${user.id}`}
        src={hasprofileImage ? profileImage : ''}
      >
        {initials}
      </Avatar>
    </Tooltip>
  )
}

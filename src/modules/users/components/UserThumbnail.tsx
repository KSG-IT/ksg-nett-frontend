import { Avatar, AvatarProps, Tooltip } from '@mantine/core'
import { UserNode, UserThumbnailProps } from 'modules/users/types'
import { Link } from 'react-router-dom'

export const UserThumbnail: React.FC<UserThumbnailProps> = ({
  size,
  user,
  radius,
}) => {
  const { profileImage, initials, fullName } = user
  const hasprofileImage = profileImage !== null
  return (
    <Tooltip label={fullName} withArrow>
      <Avatar
        size={size}
        component={Link}
        color="violet"
        to={`/users/${user.id}`}
        src={hasprofileImage ? profileImage : ''}
        radius={radius ? radius : 'xl'}
      >
        {initials}
      </Avatar>
    </Tooltip>
  )
}

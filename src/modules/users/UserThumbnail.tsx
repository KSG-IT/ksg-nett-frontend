import { Avatar, AvatarProps } from '@mantine/core'
import { UserNode } from 'modules/users/types'
import { Link } from 'react-router-dom'

interface UserThumbnailProps extends AvatarProps {
  user: Pick<UserNode, 'id' | 'profileImage' | 'initials'>
}

export const UserThumbnail: React.FC<UserThumbnailProps> = ({ size, user }) => {
  const { profileImage, initials } = user
  const hasprofileImage = profileImage !== null
  return (
    <Avatar
      size={size}
      component={Link}
      color="violet"
      to={`/users/${user.id}`}
      src={hasprofileImage ? profileImage : ''}
      radius="xl"
    >
      {initials}
    </Avatar>
  )
}

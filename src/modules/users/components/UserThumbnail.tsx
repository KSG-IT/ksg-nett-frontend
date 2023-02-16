import { Avatar, Tooltip, useMantineTheme } from '@mantine/core'
import { UserThumbnailProps } from 'modules/users/types'
import { Link } from 'react-router-dom'

export const UserThumbnail: React.FC<UserThumbnailProps> = ({
  size,
  user,
  radius,
  className,
}) => {
  const theme = useMantineTheme()
  const { profileImage, initials, getFullWithNickName } = user
  const hasprofileImage = profileImage !== null
  return (
    <Tooltip label={getFullWithNickName} withArrow withinPortal>
      <Avatar
        size={size}
        component={Link}
        color={theme.primaryColor}
        to={`/users/${user.id}`}
        src={hasprofileImage ? profileImage : ''}
        radius={radius ? radius : 'xl'}
        className={className}
      >
        {initials}
      </Avatar>
    </Tooltip>
  )
}

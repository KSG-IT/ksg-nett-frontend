import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { UserNode } from '.'

type ThumbnailSizes = 'small' | 'medium' | 'large' | 'huge' | 'fullwidth'

interface WrapperProps {
  size: ThumbnailSizes
  src: string
}

const thumbnailSize = {
  small: '18px',
  medium: '45px',
  large: '65px',
  huge: '80px',
  fullwidth: '100%',
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => thumbnailSize[props.size]};
  height: ${props => thumbnailSize[props.size]};
  border-radius: 100%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-transform: capitalize;
  font-weight: 600;

  background-image: url('${props => props.src}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

interface UserThumbnailProps {
  size: ThumbnailSizes
  user: UserNode
}

export const UserThumbnail: React.FC<UserThumbnailProps> = ({ size, user }) => {
  return (
    // Todo render image and use initials as fallback
    // Doesn't really matter since we have matt damon as a fallback
    <StyledLink to={`/users/${user.id}`}>
      <Wrapper size={size} src={user.profilePicture}>
        {user.initials}
      </Wrapper>
    </StyledLink>
  )
}

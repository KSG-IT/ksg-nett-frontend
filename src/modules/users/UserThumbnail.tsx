import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { UserNode } from '__generated__/graphql'

type ThumbnailSizes =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'huge'
  | 'fullwidth'

interface WrapperProps {
  size: ThumbnailSizes
  src?: string
}

const thumbnailSize = {
  tiny: '18px',
  small: '30px',
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
  background-color: ${props => props.theme.colors.purpleAction};
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
  user: Pick<UserNode, 'id' | 'profilePicture' | 'initials'>
}

export const UserThumbnail: React.FC<UserThumbnailProps> = ({ size, user }) => {
  const { profilePicture } = user
  const hasProfilePicture =
    !(profilePicture === undefined) || !(profilePicture === undefined)
  return (
    <StyledLink to={`/users/${user.id}`}>
      {hasProfilePicture ? (
        <Wrapper size={size} src={profilePicture!}></Wrapper>
      ) : (
        <Wrapper size={size}>{user.initials}</Wrapper>
      )}
    </StyledLink>
  )
}

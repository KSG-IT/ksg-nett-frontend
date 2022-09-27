import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { UserQueryReturns, UserQueryVariables, USER_QUERY } from '.'

const Wrapper = styled.div`
  display: grid;
  grid-template-areas:
    'profilename profilename . .'
    'image image details details'
    'quotes purchases . .';
  grid-template-columns: 1fr 2fr 2fr 2fr;
  grid-template-rows: 72px 2fr 1fr;
  width: 100%;
  height: 100%;
`

const DetailsWrapper = styled.div`
  grid-area: details;
  display: grid;
  grid-template-areas:
    'A B'
    'C D'
    'E F'
    'G H';
`

const DetailsFullname = styled.div`
  grid-area: A;
  background-color: green;
`
const DetailsPhone = styled.div`
  grid-area: B;
  background-color: red;
`

const ProfileName = styled.h2`
  margin: 0;
  grid-area: profilename;
  align-self: center;
`

const ImageWrapper = styled.div`
  grid-area: image;
  padding: 32px;
`
interface ProfileImageProps {
  src: string
}

const ProfileImage = styled.div<ProfileImageProps>`
  width: 350px;
  height: 350px;
  border-radius: 100%;

  background-image: url('${props => props.src}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
`

interface UserProfileParams {
  userId: string
}

export const UserProfile = () => {
  const { userId } = useParams<keyof UserProfileParams>() as UserProfileParams

  const { data, loading, error } = useQuery<
    UserQueryReturns,
    UserQueryVariables
  >(USER_QUERY, {
    variables: { id: userId },
  })

  if (loading) return <span>Loading</span>

  if (!data || error) return <span>Something went wrong</span>

  const { user } = data

  if (user === null || user === undefined)
    return <span>Bruker eksisterer ikke</span>
  // Permission checks for either if they are allowed to edit
  // - The user is the same as the authenticated user
  // - The user has edit permissions on user

  return (
    <Wrapper>
      <ProfileName>{user.fullName}</ProfileName>
      <ImageWrapper>
        <ProfileImage src={user.profileImage ?? ''} />
      </ImageWrapper>
      <DetailsWrapper>
        <DetailsFullname>{user.fullName}</DetailsFullname>
        <DetailsPhone>{user.phone}</DetailsPhone>
      </DetailsWrapper>
    </Wrapper>
  )
}

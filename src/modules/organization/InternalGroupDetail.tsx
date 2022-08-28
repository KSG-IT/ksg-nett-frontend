import { useQuery } from '@apollo/client'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading/FullContentLoader'
import { UserThumbnail } from 'modules/users/UserThumbnail'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { INTERNAL_GROUP_QUERY } from './queries'
import { InternalGroupReturns, InternalGroupVariables } from './types'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  border-radius: 6px;
  overflow-y: scroll;
  display: grid;
  grid-template-areas:
    'groupname groupname . .'
    'image image details details'
    'members members members members';
  ${props => props.theme.media.mobile} {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  ${props => props.theme.media.largeScreen} {
    grid-template-areas:
      'groupname'
      'image'
      'details'
      'members';
  }
  gap: 20px;
  grid-template-columns: 1fr 2fr 2fr 2fr;

  grid-template-rows: 72px 2fr 1fr;
  width: 100%;
  height: 100%;
`
const DetailsWrapper = styled.div`
  grid-area: details;
  display: grid;
  grid-auto-rows: max-content;
  background-color: white;
  border-radius: 10px;
  padding: 1.618em;
  max-height: fit-content;
`

const DetailsHeader = styled.h3`
  height: fit-content;
  padding: 0 0 5px 0;
  font-size: 1.7em;
  border-bottom: solid rgba(100, 100, 100, 0.2);
  border-width: 1px;
`

const DetailsText = styled.p`
  margin: 0 auto;
`

const GroupName = styled.h1`
  margin: 0;
  grid-area: groupname;
`
const ImageWrapper = styled.div`
  grid-area: image;
  display: flex;
  justify-content: center;
`

const MembersWrapper = styled.div`
  grid-area: members;
  display: flex;
  flex-direction: column;
`

const ThumbnailWrapper = styled.div`
  grid-area: thumbnail;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const UserFullname = styled.div`
  grid-area: name;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
`

const InternalGroupPositionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 1.618em;
  border-radius: 8px;
`

const InternalGroupPositionUsersContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  max-width: 70px;
  text-align: center;
  flex-wrap: row wrap;
`

const ContainerTitle = styled.h2`
  font-weight: 600;
  margin: 0;
  color: rgba(0, 0, 0, 0.4);
`

interface GroupImageProps {
  src: string
}

const GroupImage = styled.div<GroupImageProps>`
  height: 500px;
  width: 500px;
  border-radius: 5%;

  background-image: url('${props => props.src}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  ${props => props.theme.media.mobile} {
    display: none;
  }
`

interface InternalGroupDetailParams {
  internalGroupId: string
}

export const InternalGroupDetail: React.VFC = () => {
  const { internalGroupId } = useParams<InternalGroupDetailParams>()
  const { data, loading, error } = useQuery<
    InternalGroupReturns,
    InternalGroupVariables
  >(INTERNAL_GROUP_QUERY, {
    variables: { id: internalGroupId },
  })

  if (error) return <FullPageError />
  if (loading || !data) return <FullContentLoader />
  const { internalGroup } = data

  if (internalGroup === null) return <FullPage404 />

  return (
    <Wrapper>
      <GroupName>{internalGroup.name}</GroupName>
      <ImageWrapper>
        <GroupImage src={internalGroup.groupImage ?? ''} />
      </ImageWrapper>
      <DetailsWrapper>
        <DetailsHeader>Beskrivelse av gjengen</DetailsHeader>
        <DetailsText>{internalGroup.description}</DetailsText>
      </DetailsWrapper>
      <MembersWrapper>
        {internalGroup.membershipData.map(position => (
          <InternalGroupPositionContainer>
            <ContainerTitle>
              {position.internalGroupPositionName}
            </ContainerTitle>
            <InternalGroupPositionUsersContainer>
              {position.users.map(user => (
                <ThumbnailWrapper>
                  <UserThumbnail user={user} size="md" key={user.id} />
                  <UserFullname>{user.fullName}</UserFullname>
                </ThumbnailWrapper>
              ))}
            </InternalGroupPositionUsersContainer>
          </InternalGroupPositionContainer>
        ))}
      </MembersWrapper>
    </Wrapper>
  )
}

import { useQuery } from '@apollo/client'
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
    'quotes shifts . .';
  grid-template-columns: 1fr 2fr 2fr 2fr;
  grid-template-rows: 72px 2fr 1fr;
  width: 100%;
  height: 100%;
`
const DetailsWrapper = styled.div`
  grid-area: details;
  display: grid;
  grid-auto-rows: max-content;
  //background-color: #6EEB83;
`

const DetailsHeader = styled.h3`
  //background-color: #BCB6FF;
  height: fit-content;
  padding-top: 5px;
  padding-left: 10px;
  font-size: 1.7em;
  border-bottom: solid slategrey;
`

const DetailsText = styled.div`
  //background-color: #FF82A9;
`

const GroupName = styled.h2`
  margin: 0;
  grid-area: groupname;
  align-self: center;
  //background-color: #E4FF1A;
`
const ImageWrapper = styled.div`
  grid-area: image;
  padding: 32px;
  //background-color: #1BE7FF;
`

interface GroupImageProps {
  src: string
}

const GroupImage = styled.div<GroupImageProps>`
  width: 350px;
  height: 350px;
  border-radius: 5%;

  background-image: url('${props => props.src}');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
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

  if (loading) return <span>Loading</span>

  if (!data || error) return <span>Something went wrong</span>

  const { internalGroup } = data

  if (internalGroup === null || internalGroup === undefined)
    return <span>Interngruppen eksisterer ikke</span>

  return (
    <Wrapper>
      <GroupName>{internalGroup.name}</GroupName>
      <ImageWrapper>
        <GroupImage src={internalGroup.groupImage ?? ''} />
      </ImageWrapper>
      <DetailsWrapper>
        <DetailsHeader>Beskrivelse</DetailsHeader>
        <DetailsText>{internalGroup.description}</DetailsText>
      </DetailsWrapper>
    </Wrapper>
  )
}

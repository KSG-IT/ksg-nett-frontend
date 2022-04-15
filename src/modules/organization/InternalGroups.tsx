import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { InternalGroupCard } from './InternalGroupCard'
import { ALL_INTERNAL_GROUPS_QUERY } from './queries'
import { InternalGroupNode } from './types'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  border-radius: 6px;
  overflow-y: scroll;
`

const InternalGroupsContainerTitle = styled.h2`
  display: flex;
  margin: 0;
  color: black;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 2rem;
`

const InternalGroupsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  ${props => props.theme.media.largeScreen} {
    grid-template-columns: 1fr 1fr;
  }
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
  gap: 10px;
  border-radius: 4px;
  margin-bottom: 1.618em;
`

interface AllInternalGroupsReturns {
  internalGroups: InternalGroupNode[]
  interestGroups: InternalGroupNode[]
}

export const InternalGroups: React.VFC = () => {
  const history = useHistory()

  const allInternalGroupTypesQuery = useQuery<AllInternalGroupsReturns>(
    ALL_INTERNAL_GROUPS_QUERY
  )

  if (allInternalGroupTypesQuery.error) return <FullPageError />
  if (allInternalGroupTypesQuery.loading || !allInternalGroupTypesQuery.data)
    return <FullContentLoader />

  const internalGroups = allInternalGroupTypesQuery.data?.internalGroups
  const interestGroups = allInternalGroupTypesQuery.data?.interestGroups

  return (
    <Wrapper>
      <InternalGroupsContainerTitle>Drift</InternalGroupsContainerTitle>
      <InternalGroupsContainer>
        {internalGroups.map((group: InternalGroupNode) => (
          <div
            key={group.id}
            onClick={() => {
              history.push(`/internal-groups/${group.id}`)
            }}
          >
            <InternalGroupCard internalGroup={group} />
          </div>
        ))}
      </InternalGroupsContainer>
      <InternalGroupsContainerTitle>
        Interessegrupper
      </InternalGroupsContainerTitle>
      <InternalGroupsContainer>
        {interestGroups.map((group: InternalGroupNode) => (
          <div
            key={group.id}
            onClick={() => {
              history.push(`/internal-groups/${group.id}`)
            }}
          >
            <InternalGroupCard internalGroup={group} />
          </div>
        ))}
      </InternalGroupsContainer>
    </Wrapper>
  )
}

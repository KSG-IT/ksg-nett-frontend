import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { InternalGroupCard } from './InternalGroupCard'
import { ALL_INTEREST_GROUPS, ALL_INTERNAL_WORK_GROUPS } from './queries'
import { InternalGroupNode } from './types'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  border-radius: 6px;
  overflow-y: scroll;
`

const InternalGroupsFlexContainer = styled.div`
  justify-content: flex-start;
  flex-flow: row wrap;
  margin-top: 10px;
  gap: 1.5rem;
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
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
  ${props => props.theme.media.smallScreen} {
    grid-template-columns: 1fr;
  }
  gap: 10px;
  border-radius: 4px;
`

interface AllInternalGroupsReturns {
  allInternalWorkGroups: InternalGroupNode[]
}

interface AllInterestGroupsReturns {
  allInterestGroups: InternalGroupNode[]
}

export const InternalGroups: React.VFC = () => {
  const history = useHistory()
  const {
    loading: internalLoading,
    error: internalError,
    data: internalData,
  } = useQuery<AllInternalGroupsReturns>(ALL_INTERNAL_WORK_GROUPS)
  const {
    loading: interestLoading,
    error: interestError,
    data: interestData,
  } = useQuery<AllInterestGroupsReturns>(ALL_INTEREST_GROUPS)

  if (internalError) return <FullPageError />
  if (internalLoading || !internalData) return <FullContentLoader />

  if (interestLoading || !interestData) return <FullContentLoader />

  const { allInternalWorkGroups } = internalData
  const { allInterestGroups } = interestData

  return (
    <Wrapper>
      <InternalGroupsFlexContainer>
        <InternalGroupsContainerTitle>Drift</InternalGroupsContainerTitle>
        <InternalGroupsContainer>
          {allInternalWorkGroups.map((group: InternalGroupNode) => (
            <div
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
          {allInterestGroups.map((group: InternalGroupNode) => (
            <div
              onClick={() => {
                history.push(`/internal-groups/${group.id}`)
              }}
            >
              <InternalGroupCard internalGroup={group} />
            </div>
          ))}
        </InternalGroupsContainer>
      </InternalGroupsFlexContainer>
    </Wrapper>
  )
}

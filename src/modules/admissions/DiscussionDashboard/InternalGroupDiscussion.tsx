import { useQuery } from '@apollo/client'
import { Card } from 'components/Card'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { DiscussApplicantsTable } from './DicussApplicantsTable'
import { INTERNAL_GROUP_DISCUSSION_DATA } from './queries'
import { InternalGroupDiscussionDataReturns } from './types'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  gap: 15px;
`

const ProcessedApplicantsContainer = styled.div`
  grid-area: processed;
  display: flex;
  flex-direction: column;
`

interface InternalGroupDiscussionParams {
  internalGroupId: string
}

export const InternalGroupDiscussion: React.VFC = () => {
  const { internalGroupId } = useParams<InternalGroupDiscussionParams>()

  const { error, loading, data } = useQuery<InternalGroupDiscussionDataReturns>(
    INTERNAL_GROUP_DISCUSSION_DATA,
    {
      variables: { internalGroupId: internalGroupId },
      pollInterval: 1000 * 30, // polls every half minute
    }
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const {
    internalGroupDiscussionData: {
      availablePicks,
      processedApplicants,
      internalGroup,
    },
  } = data

  return (
    <Wrapper>
      <h1>Fordelingsmøte {internalGroup.name}</h1>
      <Card>
        <div>Statistikk</div>
      </Card>
      <Card>
        <DiscussApplicantsTable
          internalGroupPositionPriorites={availablePicks}
          internalGroup={internalGroup}
        />
      </Card>

      {/* DEPRECATED MAYBE*/}
      <Card>
        <ProcessedApplicantsContainer>
          <h2>Ferdigvurderte søkere</h2>
          {processedApplicants.map(internalGroupPositionPriority => (
            <span>
              {internalGroupPositionPriority.applicant.fullName}{' '}
              {internalGroupPositionPriority.internalGroupPriority}
            </span>
          ))}
        </ProcessedApplicantsContainer>
      </Card>
    </Wrapper>
  )
}

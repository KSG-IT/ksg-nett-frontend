import { useMutation, useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { PATCH_INTERNAL_GROUP } from 'modules/organization/mutations'
import {
  PatchInternalGroupReturns,
  PatchInternalGroupVariables,
} from 'modules/organization/types'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { PatchMutationVariables } from 'types/graphql'
import { ApplicantNode, InternalGroupPositionPriorityNode } from '../types'
import { DiscussApplicantCard } from './DiscussApplicantCard'
import { PATCH_INTERNAL_GROUP_POSITION_PRIORITY } from './mutations'
import { INTERNAL_GROUP_DISCUSSION_DATA } from './queries'
import {
  InternalGroupDiscussionDataReturns,
  PatchInternalGroupPositionPriorityReturns,
} from './types'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  display: grid;
  height: 100%;
  overflow-y: scroll;
  grid-template-areas:
    'title .'
    'activediscussion availablepicks'
    'processed .';
  grid-template-column: 2fr 1fr;
  grid-gap: 15px;
`

const AvailablePicksContainer = styled.div`
  grid-area: availablepicks;
  display: flex;
  flex-direction: column;
`
const AvailablePicksTitle = styled.h2`
  margin: 0;
`

const AvailablePicksRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const DiscussCardContainer = styled.div`
  grid-area: activediscussion;
`

const ProcessedApplicantsContainer = styled.div`
  grid-area: processed;
`

interface InternalGroupDiscussionParams {
  internalGroupId: string
}

export const InternalGroupDiscussion: React.VFC = () => {
  const { internalGroupId } = useParams<InternalGroupDiscussionParams>()
  /**
   * LIST
   * 1. Add typing for query
   * 2. Start extracting and dispoaying it in different regions
   * 3. Add component for Discussion card which shows details of applicant and who has
   * interviewed it as well
   * 4. Add buttons with mutations to discuss an applicant
   *  > an applicant can either be given WANT DO_NOT_WANT or PASSAROUND
   * > The PASSAROUND should go in some free for all pile
   * > Can maybe add some "discussion started" timer
   */

  const [patchInternalGroup] = useMutation<
    PatchInternalGroupReturns,
    PatchInternalGroupVariables
  >(PATCH_INTERNAL_GROUP, {
    refetchQueries: ['InternalGroupDiscussionDataQuery'],
  })

  const [patchInternalGroupPositionPriority] = useMutation<
    PatchInternalGroupPositionPriorityReturns,
    PatchMutationVariables<InternalGroupPositionPriorityNode>
  >(PATCH_INTERNAL_GROUP_POSITION_PRIORITY, {
    refetchQueries: ['InternalGroupDiscussionDataQuery'],
  })

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
      currentApplicantUnderDiscussion,
      firstPicks,
      availableSecondPicks,
      availableThirdPicks,
      processedApplicants,
      internalGroup,
    },
  } = data

  const availablePicks = [
    ...firstPicks,
    ...availableSecondPicks,
    ...availableThirdPicks,
  ]

  const handleDiscussApplicant = (applicant: ApplicantNode) => {
    if (currentApplicantUnderDiscussion !== null) {
      toast.error(
        `${currentApplicantUnderDiscussion.fullName} må diskuteres ferdig først`
      )
      return
    }

    patchInternalGroup({
      variables: {
        id: internalGroup.id,
        input: { currentlyDiscussing: applicant.id },
      },
    })
  }

  const handleSetApplicantStatus = (
    status: 'WANT' | 'DO_NOT_WANT' | 'RESERVE' | 'PASS_AROUND'
  ) => {
    // This should probably prompt the user so they have to confirm their status
  }

  return (
    <Wrapper>
      <h1>Fordelingsmøte {internalGroup.name}</h1>
      <DiscussCardContainer>
        <DiscussApplicantCard
          applicant={currentApplicantUnderDiscussion}
          internalGroup={internalGroup}
        />
      </DiscussCardContainer>
      <AvailablePicksContainer>
        <AvailablePicksTitle>TIlgjengelige for diskusjon</AvailablePicksTitle>
        {availablePicks.map(internalGroupPriority => (
          <AvailablePicksRow>
            <span>{internalGroupPriority.applicant.fullName}</span>
            <span>{internalGroupPriority.applicantPriority}</span>
            <button
              onClick={() =>
                handleDiscussApplicant(internalGroupPriority.applicant)
              }
            >
              Diskuter søker
            </button>
          </AvailablePicksRow>
        ))}
      </AvailablePicksContainer>
      <ProcessedApplicantsContainer>
        <h2>Ferdigvurderte søkere</h2>
        {processedApplicants.map(internalGroupPositionPriority => (
          <span>{internalGroupPositionPriority.applicant.fullName}</span>
        ))}
      </ProcessedApplicantsContainer>
    </Wrapper>
  )
}

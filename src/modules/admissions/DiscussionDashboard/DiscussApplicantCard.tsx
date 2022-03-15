import { useMutation } from '@apollo/client'
import { Card } from 'components/Card'
import { formatDistanceToNow } from 'date-fns'
import {
  ApplicantNode,
  InternalGroupPositionPriorityNode,
  InternalGroupPriority,
} from 'modules/admissions/types'
import { PATCH_INTERNAL_GROUP } from 'modules/organization/mutations'
import {
  InternalGroupNode,
  PatchInternalGroupReturns,
} from 'modules/organization/types'
import { UserThumbnail } from 'modules/users'
import styled from 'styled-components'
import { PatchMutationVariables } from 'types/graphql'
import { PATCH_INTERNAL_GROUP_POSITION_PRIORITY } from './mutations'
import { PatchInternalGroupPositionPriorityReturns } from './types'
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-areas:
    'applicantname actions'
    'discussiontimer interviewers'
    'additionalinfo statements'
    'interviewnotes statements'
    'interviewdiscussion image';
  grid-template-columns: 4fr 1fr;
`

const ApplicantName = styled.h2`
  margin: 0;
  grid-area: applicantname;
`

const ImageContainer = styled.div`
  grid-area: image;
`

const ApplicantImage = styled.img`
  aspect-ratio: 1/1;
  max-width: 150px;
`

const AdditionalInfoContainer = styled.div`
  grid-area: additionalinfo;
`

const ActionsContainer = styled.div`
  grid-area: actions;
`

const InterviewNotesContainer = styled.div`
  grid-area: interviewnotes;
  display: flex;
  flex-direction: column;
`

const InterviewDiscussionContainer = styled.div`
  grid-area: interviewdiscussion;
  display: flex;
  flex-direction: column;
`

const InterviewersContainer = styled.div`
  grid-area: interviewers;

  div:last-child {
    display: flex;
    flex-direction: row;
  }
`

const StatementsContainer = styled.div`
  grid-area: statements;
`

const DiscussionTimerContainer = styled.div`
  grid-area: discussiontimer;
`

interface DiscussApplicantCardProps {
  applicant: ApplicantNode | null
  internalGroup: InternalGroupNode
}

export const DiscussApplicantCard: React.VFC<DiscussApplicantCardProps> = ({
  applicant,
  internalGroup,
}) => {
  const [patchInternalGroupPositionPriority] = useMutation<
    PatchInternalGroupPositionPriorityReturns,
    PatchMutationVariables<InternalGroupPositionPriorityNode>
  >(PATCH_INTERNAL_GROUP_POSITION_PRIORITY, {
    refetchQueries: ['InternalGroupDiscussionDataQuery'],
  })

  const [patchInternalGroup] = useMutation<
    PatchInternalGroupReturns,
    PatchMutationVariables<InternalGroupNode>
  >(PATCH_INTERNAL_GROUP, {
    refetchQueries: ['InternalGroupDiscussionDataQuery'],
  })

  if (applicant === null)
    return <Card>Ingen søker har blitt satt til diskusjon enda</Card>

  const { interview } = applicant

  // This case is probably impossible  seeing as we filter these away? Maybe not
  if (interview === null) return <Card>Søkeren har ikke hatt intervju</Card>
  const evaulations = [
    ...interview.booleanEvaluationAnswers,
    ...interview.additionalEvaluationAnswers,
  ]

  const parseEvaluationAnswer = (answer: boolean | string) => {
    if (answer === true) {
      return 'Ja'
    } else if (answer === false) {
      return 'Nei'
    } else {
      return answer
    }
  }

  const handleSetApplicantStatus = (status: InternalGroupPriority) => {
    // This should probably prompt the user so they have to confirm their status
    console.log(applicant.priorities)
    console.log(internalGroup)
    // We find the id of the priority for this internal group
    const priorityId = applicant.priorities.filter(priority => {
      if (priority === null) return false

      return (
        priority.internalGroupPosition.internalGroup.id === internalGroup.id
      )
    })

    if (priorityId[0] === null) return

    patchInternalGroupPositionPriority({
      variables: {
        id: priorityId[0].id,
        input: { internalGroupPriority: status },
      },
    }).then(res => {
      const { data } = res
      if (data === null || data === undefined) return
      patchInternalGroup({
        variables: {
          id: internalGroup.id,
          input: { currentlyDiscussing: null },
        },
      })
    })
  }

  const hasImage = applicant.image !== null

  return (
    <Card>
      <Wrapper>
        <ApplicantName>{applicant.fullName}</ApplicantName>
        <ActionsContainer>
          {/* This is probably not a good way to deal with it */}
          <button
            onClick={() => {
              handleSetApplicantStatus('WANT')
            }}
          >
            Vil ha
          </button>
          <button
            onClick={() => {
              handleSetApplicantStatus('DO_NOT_WANT')
            }}
          >
            Vil ikka ha
          </button>
          <button
            onClick={() => {
              handleSetApplicantStatus('RESERVE')
            }}
          >
            Reserve
          </button>
          <button
            onClick={() => {
              handleSetApplicantStatus('PASS_AROUND')
            }}
          >
            Send på runde
          </button>
        </ActionsContainer>
        <DiscussionTimerContainer>
          Kandidaten har vært diskutert i
          {formatDistanceToNow(new Date(applicant.discussionStart as Date))}
          {/* ToDo: Live counter */}
        </DiscussionTimerContainer>
        <AdditionalInfoContainer>
          {interview.totalEvaluation}
          {interview.canCommitThreeSemesters}
          {interview.cannotCommitThreeSemestersDetails}
        </AdditionalInfoContainer>
        <InterviewersContainer>
          <h2>Intervjuere</h2>
          <div>
            {applicant.interview!.interviewers.map((user, index) => (
              <UserThumbnail user={user} size="medium" key={index} />
            ))}
          </div>
        </InterviewersContainer>
        <InterviewNotesContainer>
          <h2>Notater fra intervju</h2>
          <p>{interview.notes}</p>
        </InterviewNotesContainer>
        <InterviewDiscussionContainer>
          <h2>Diskusjon fra intervju</h2>
          <p>{interview.discussion}</p>
        </InterviewDiscussionContainer>
        <StatementsContainer>
          {evaulations.map(evaluation => (
            <div key={evaluation.statement}>
              <span>{evaluation.statement}</span>
              <br></br>
              <span>{parseEvaluationAnswer(evaluation.answer)}</span>
            </div>
          ))}
        </StatementsContainer>
        <ImageContainer>
          {hasImage ? (
            <ApplicantImage src={applicant.image as string} />
          ) : (
            <span>Søkeren har ikke bilde</span>
          )}
        </ImageContainer>
      </Wrapper>
    </Card>
  )
}

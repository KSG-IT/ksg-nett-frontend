import { useMutation } from '@apollo/client'
import { useStore } from 'store'
import styled from 'styled-components'
import { REMOVE_SELF_AS_INTERVIEWER, SET_SELF_AS_INTERVIEWER } from './mutation'
import {
  CoreApplicantNode,
  SetSelfAsInterviewerMutatationReturns,
  SetSelfAsInterviewerMutatationVariables,
} from './types'

interface WrapperProps {
  needsAttention: boolean
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  padding: 5px 0;
  margin: 2px 0;
  color: white;
  background-color: ${props =>
    props.needsAttention
      ? props.theme.colors.error
      : props.theme.colors.successGreen};
`

interface InterviewerActionsProps {
  applicant: CoreApplicantNode
}

export const InterviewerActions: React.VFC<InterviewerActionsProps> = ({
  applicant,
}) => {
  const user = useStore(state => state.user)

  const { interviewerFromInternalGroup, interview } = applicant
  const needsAttention = interviewerFromInternalGroup === null
  const [setSelfAstInterviewer, { loading }] = useMutation<
    SetSelfAsInterviewerMutatationReturns,
    SetSelfAsInterviewerMutatationVariables
  >(SET_SELF_AS_INTERVIEWER, {
    refetchQueries: ['InternalGroupApplicantsDataQuery'],
  })

  const [removeSelfAstInterviewer, { loading: removeLoader }] = useMutation(
    REMOVE_SELF_AS_INTERVIEWER,
    {
      refetchQueries: ['InternalGroupApplicantsDataQuery'],
    }
  )

  const handleSetSelfAsInterviewer = () => {
    if (interview === null) return

    setSelfAstInterviewer({
      variables: { interviewId: interview.id },
    })
  }

  const handleRemoveSelfAsInterviewer = () => {
    if (interview === null) return

    removeSelfAstInterviewer({
      variables: { interviewId: interview.id },
    })
  }

  const handleRenderAction = () => {
    if (interview === null)
      return <span>Søkeren har ikke meldt seg til intervju </span>

    if (user!.id === interviewerFromInternalGroup) {
      return (
        <button onClick={handleRemoveSelfAsInterviewer} disabled={removeLoader}>
          Meld av fra intervju
        </button>
      )
    }
    if (interviewerFromInternalGroup !== null) {
      return <span>Noen fra gjengen er meldt opp</span>
    }

    return (
      <button onClick={handleSetSelfAsInterviewer} disabled={loading}>
        Meld opp til intervju
      </button>
    )
  }
  return (
    <Wrapper needsAttention={needsAttention}>
      <span>{applicant.fullName}</span>
      <span>{applicant.phone}</span>
      {handleRenderAction()}
    </Wrapper>
  )
}

import { useMutation, useQuery } from '@apollo/client'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserThumbnail } from 'modules/users'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { PATCH_INTERVIEW } from './mutations'
import { APPLICANT_QUERY } from './queries'
import { ApplicantQueryReturns, ApplicantQueryVariables } from './types'

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  overflow-y: scroll;
`

const ApplicantName = styled.h2``

const InterviewersContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

const StatementsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StatementRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

interface ApplicantDetailsParams {
  applicantId: string
}

export const ApplicantDetails: React.VFC = () => {
  const { applicantId } = useParams<ApplicantDetailsParams>()
  const [editMode, setEditMode] = useState(false)

  const { data, loading, error } = useQuery<
    ApplicantQueryReturns,
    ApplicantQueryVariables
  >(APPLICANT_QUERY, { variables: { id: applicantId }, pollInterval: 10000 })

  const [patchInterview] = useMutation(PATCH_INTERVIEW)

  useEffect(() => {
    if (!editMode) return

    // In here we handle note taking changes
    // If this is an editor we write to the db periodically
  }, [editMode])

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { applicant } = data

  if (applicant === null) return <FullPage404 />

  const { interview } = applicant

  if (interview === null)
    return <span>Søker har ikke satt seg opp til intervju</span>

  return (
    <Wrapper>
      <ApplicantName>{applicant.fullName}</ApplicantName>{' '}
      <button
        onClick={() => {
          setEditMode(!editMode)
        }}
      >
        Skriv notater
      </button>
      <div>
        <h3>Intevjuere</h3>
        <InterviewersContainer>
          {interview.interviewers.map(user => (
            <UserThumbnail user={user} size="medium" />
          ))}
        </InterviewersContainer>
      </div>
      <div>Status: {applicant.status}</div>
      <div>
        <h3>Ja/nei spørsmål</h3>
        <StatementsContainer>
          {interview.booleanEvaluationAnswers.map(evaluation => (
            <StatementRow>
              {evaluation.statement}
              {evaluation.answer ? <span> ja</span> : <span>Nei</span>}
            </StatementRow>
          ))}
        </StatementsContainer>
      </div>
      <div>
        <h3>Intervjunotater</h3>
        {interview.notes}
      </div>
      <div>
        <h3>Diskusjon</h3>
        {interview.discussion}
      </div>
    </Wrapper>
  )
}

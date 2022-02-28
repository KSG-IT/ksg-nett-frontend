import { useQuery } from '@apollo/client'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserThumbnail } from 'modules/users'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
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

  const { data, loading, error } = useQuery<
    ApplicantQueryReturns,
    ApplicantQueryVariables
  >(APPLICANT_QUERY, { variables: { id: applicantId } })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { applicant } = data

  if (applicant === null) return <FullPage404 />

  return (
    <Wrapper>
      <ApplicantName>{applicant.fullName}</ApplicantName>
      <div>
        <h3>Intevjuere</h3>
        <InterviewersContainer>
          {applicant.interview.interviewers.map(user => (
            <UserThumbnail user={user} size="medium" />
          ))}
        </InterviewersContainer>
      </div>
      <div>Status: {applicant.status}</div>
      <div>
        <h3>Ja/nei spørsmål</h3>
        <StatementsContainer>
          {applicant.interview.booleanEvaluationAnswers.map(evaluation => (
            <StatementRow>
              {evaluation.statement}
              {evaluation.answer ? <span> ja</span> : <span>Nei</span>}
            </StatementRow>
          ))}
        </StatementsContainer>
      </div>
      <div>
        <h3>Intervjunotater</h3>
        {applicant.interview.notes}
      </div>
      <div>
        <h3>Diskusjon</h3>
        {applicant.interview.discussion}
      </div>
    </Wrapper>
  )
}

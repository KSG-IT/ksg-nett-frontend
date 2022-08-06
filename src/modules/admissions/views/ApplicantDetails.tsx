import { useQuery } from '@apollo/client'
import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { FullPage404, FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { UserThumbnail } from 'modules/users'
import ReactMarkdown from 'react-markdown'
import { useHistory, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'
import { ApplicantStatusBadge } from '../components/ApplicantStatusBadge'
import {
  parseAdditionalEvaluation,
  parseBooleanEvaluation,
  parseTotalEvaluation,
} from '../parsing'
import { APPLICANT_QUERY } from '../queries'
import {
  ApplicantQueryReturns,
  ApplicantQueryVariables,
} from '../types.graphql'
const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  overflow-y: scroll;
`

interface ApplicantDetailsParams {
  applicantId: string
}

/**
 * This component is effectively a merge of the data from an Applicant
 * and their Interview object. It will poll the backend for the latest
 * data every 10 seconds.
 */
export const ApplicantDetails: React.VFC = () => {
  const { applicantId } = useParams<ApplicantDetailsParams>()
  const history = useHistory()

  const { data, loading, error } = useQuery<
    ApplicantQueryReturns,
    ApplicantQueryVariables
  >(APPLICANT_QUERY, { variables: { id: applicantId }, pollInterval: 10000 })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { applicant } = data

  if (applicant === null) return <FullPage404 />

  const { interview } = applicant

  // This is probably a bit flaky.
  const interviewFinished = applicant.status === 'INTERVIEW_FINISHED'

  if (interview === null)
    return <span>Søker har ikke satt seg opp til intervju</span>

  return (
    <Wrapper>
      {/* Rewrite Wrapper to Stack? */}
      {/* Top level part should have a details card with perosanl information and image */}
      <Title>Kandidatdetaljer</Title>
      <Card>
        <Group>
          <Text size="lg" weight="bold">
            {applicant.fullName}
          </Text>
          <ApplicantStatusBadge applicantStatus={applicant.status} />
        </Group>
        <Group>
          <Text>Total vurdering</Text>
          <Text>{parseTotalEvaluation(interview.totalEvaluation)}</Text>
        </Group>
        <Group>
          <Text>Kan bli 3 semestre</Text>
          {parseBooleanEvaluation(applicant.canCommitThreeSemesters)}
        </Group>
      </Card>
      {!interviewFinished && (
        <Button
          onClick={() => {
            history.push(`/admissions/interviews/${interview.id}/edit`)
          }}
        >
          Skriv notater
        </Button>
      )}
      <Title>Intevjuere</Title>
      <Card>
        <Group>
          {interview.interviewers.map(user => (
            <UserThumbnail user={user} size="medium" />
          ))}
        </Group>
      </Card>
      <Title>Vurderinger</Title>
      <Card>
        <Group align="flex-start">
          <Stack justify="flex-start">
            {interview.booleanEvaluationAnswers.map(evaluation => (
              <Stack mt="xs">
                <Text weight="bold">{evaluation.statement.statement}</Text>
                <Text>{parseBooleanEvaluation(evaluation.value)}</Text>
              </Stack>
            ))}
          </Stack>
          <Stack justify="flex-start">
            {interview.additionalEvaluationAnswers.map(evaluation => (
              <Stack mt="xs">
                <Text weight="bold">{evaluation.statement.statement}</Text>
                <Text>{parseAdditionalEvaluation(evaluation.answer)}</Text>
              </Stack>
            ))}
          </Stack>
        </Group>
      </Card>

      <Stack>
        <Title>Intervjunotater</Title>
        <Card p="xs">
          <ReactMarkdown plugins={[remarkGfm]}>{interview.notes}</ReactMarkdown>
        </Card>
      </Stack>
      <Stack>
        <Title>Diskusjonsnotater</Title>
        <Card p="xs">
          <ReactMarkdown plugins={[remarkGfm]}>
            {interview.discussion}
          </ReactMarkdown>
        </Card>
      </Stack>
    </Wrapper>
  )
}
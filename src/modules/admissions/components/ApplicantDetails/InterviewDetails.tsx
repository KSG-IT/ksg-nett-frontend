import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { MessageBox } from 'components/MessageBox'
import { format } from 'date-fns'
import {
  parseAdditionalEvaluation,
  parseBooleanEvaluation,
  parseTotalEvaluation,
} from 'modules/admissions/parsing'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { UserThumbnail } from 'modules/users'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

interface InterviewDetailsProps {
  applicant: ApplicantNode
  canEdit: boolean
}

export const InterviewDetails: React.VFC<InterviewDetailsProps> = ({
  applicant,
  canEdit,
}) => {
  const { interview } = applicant
  const history = useNavigate()
  if (interview === null) {
    return (
      <Stack style={{ maxWidth: 800 }} my="lg">
        <Title order={2}>Intrvjudetaljer</Title>
        <MessageBox type="warning">
          Søker har ikke satt seg opp til intervju enda
        </MessageBox>
      </Stack>
    )
  }

  return (
    <Stack>
      {/* Rewrite Wrapper to Stack? */}
      {/* Top level part should have a details card with perosanl information and image */}
      <Title order={2}>Intervjudetaljer</Title>
      {applicant.wantsDigitalInterview && (
        <MessageBox type="warning">
          <b>Obs!</b> Søker ønsker digitalt intervju
        </MessageBox>
      )}
      <Card>
        <Group>
          <Text weight="bold">Intervjutid</Text>
          <Text>
            {format(new Date(interview.interviewStart), 'iii d MMM HH:mm')}
          </Text>
        </Group>
        <Group>
          <Text weight="bold">Intervjusted</Text>
          <Text>{interview.location.name}</Text>
        </Group>
      </Card>
      <Card>
        <Group>
          <Text>Total vurdering:</Text>
          <Text>{parseTotalEvaluation(interview.totalEvaluation)}</Text>
        </Group>
        <Group>
          <Text>Kan bli 3 semestre:</Text>
          {parseBooleanEvaluation(applicant.canCommitThreeSemesters)}
        </Group>
        <Group>
          <Text>Åpen for andre verv:</Text>
          {parseBooleanEvaluation(applicant.openForOtherPositions)}
        </Group>
      </Card>
      {canEdit && (
        <Button
          onClick={() => {
            navigate(`/admissions/interviews/${interview.id}/edit`)
          }}
        >
          Skriv notater
        </Button>
      )}
      <Title>Intevjuere</Title>
      <Card>
        <Group>
          {interview.interviewers.map(user => (
            <UserThumbnail user={user} size="md" />
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
    </Stack>
  )
}

import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import {
  CREATE_INTERVIEW_ADDITIONAL_EVALUATION_STATEMENT,
  CREATE_INTERVIEW_BOOLEAN_EVALUATION,
  DELETE_INTERVIEW_ADDITIONAL_EVALUATION_STATEMENT,
  DELETE_INTERVIEW_BOOLEAN_EVALUATION,
} from 'modules/admissions/mutations'
import { INTERVIEW_TEMPLATE_QUERY } from 'modules/admissions/queries'
import { InterviewTemplateReturns } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'

type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'

interface ConfigureInterviewTemplateProps {
  setStageCallback: (stage: WizardStage) => void
}

export const ConfigureInterviewTemplate: React.VFC<
  ConfigureInterviewTemplateProps
> = ({ setStageCallback }) => {
  const [interviewBooleanEvaluation, setInterviewBooleanEvaluation] =
    useState('')
  const [
    interviewAdditionalEvaluationStatement,
    setInterviewAdditionalEvaluationStatement,
  ] = useState('')

  const [createInterviewBooleanEvaluation] = useMutation(
    CREATE_INTERVIEW_BOOLEAN_EVALUATION,
    {
      variables: { input: { statement: interviewBooleanEvaluation } },
      refetchQueries: ['InterviewTemplateQuery'],
      fetchPolicy: 'network-only',
    }
  )
  const [createInterviewAdditionalEvaluationStatement] = useMutation(
    CREATE_INTERVIEW_ADDITIONAL_EVALUATION_STATEMENT,
    {
      variables: {
        input: { statement: interviewAdditionalEvaluationStatement },
      },
      refetchQueries: ['InterviewTemplateQuery'],
    }
  )

  const [deleteInterviewBooleanEvaluationStatements] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_INTERVIEW_BOOLEAN_EVALUATION, {
    refetchQueries: ['InterviewTemplateQuery'],
  })

  const [deleteInterviewAdditionalEvaluationStatements] = useMutation<
    DeleteMutationReturns,
    DeleteMutationVariables
  >(DELETE_INTERVIEW_ADDITIONAL_EVALUATION_STATEMENT, {
    refetchQueries: ['InterviewTemplateQuery'],
  })
  const { loading, data, error } = useQuery<InterviewTemplateReturns>(
    INTERVIEW_TEMPLATE_QUERY
  )

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleDeleteInterviewBooleanEvaluationStatements = (id: string) => {
    deleteInterviewBooleanEvaluationStatements({ variables: { id: id } })
  }
  const handleDeleteInterviewAdditionalEvaluationStatements = (id: string) => {
    deleteInterviewAdditionalEvaluationStatements({ variables: { id: id } })
  }

  const handleCreateInterviewBooleanEvaluation = () => {
    if (interviewBooleanEvaluation === '') {
      toast.error('Spørsmålet kan ikke være tomt')
      return
    }
    createInterviewBooleanEvaluation()
    setInterviewBooleanEvaluation('')
  }
  const handleCreateInterviewAdditionalEvaluationStatement = () => {
    if (interviewAdditionalEvaluationStatement === '') {
      toast.error('Spørsmålet kan ikke være tomt')
      return
    }
    createInterviewAdditionalEvaluationStatement()
    setInterviewAdditionalEvaluationStatement('')
  }

  const {
    interviewTemplate: {
      interviewBooleanEvaluationStatements,
      interviewAdditionalEvaluationStatements,
    },
  } = data

  return (
    <Stack>
      <Title>Intervjumal spørsmål</Title>
      <Card>
        <Stack>
          <Title order={2}>Ja/Nei spørsmål</Title>
          {interviewBooleanEvaluationStatements.map(node => (
            <Group key={node.id}>
              <span>{node.statement}</span>
              <IconTrash
                onClick={() =>
                  handleDeleteInterviewBooleanEvaluationStatements(node.id)
                }
              />
            </Group>
          ))}
        </Stack>
      </Card>
      <Group align="flex-end">
        <Text>Legg til ja/nei spørsmål</Text>
        <TextInput
          value={interviewBooleanEvaluation}
          onChange={evt => setInterviewBooleanEvaluation(evt.target.value)}
        />
        <Button
          color="samfundet-red"
          variant="subtle"
          leftIcon={<IconPlus />}
          onClick={handleCreateInterviewBooleanEvaluation}
        >
          Legg til
        </Button>
      </Group>
      <Card>
        <Stack>
          <Title order={3}>Vurderingsspørsmål</Title>
          {interviewAdditionalEvaluationStatements.map(node => (
            <Group key={node.id}>
              <Text>{node.statement}</Text>
              <UnstyledButton>
                <IconTrash
                  onClick={() =>
                    handleDeleteInterviewAdditionalEvaluationStatements(node.id)
                  }
                />
              </UnstyledButton>
            </Group>
          ))}
        </Stack>
      </Card>
      <Group align="flex-end">
        <Text>Vurderingsspørsmål</Text>
        <TextInput
          value={interviewAdditionalEvaluationStatement}
          onChange={evt =>
            setInterviewAdditionalEvaluationStatement(evt.target.value)
          }
        />
        <Button
          color="samfundet-red"
          variant="subtle"
          leftIcon={<IconPlus />}
          onClick={handleCreateInterviewAdditionalEvaluationStatement}
        >
          Legg til
        </Button>
      </Group>
      <Group>
        <Button
          color="samfundet-red"
          onClick={() => setStageCallback('INTERVIEW_LOCATION_AVAILABILITY')}
        >
          Forrige steg
        </Button>
        <Button
          color="samfundet-red"
          onClick={() => setStageCallback('AVAILABLE_POSITIONS')}
        >
          Neste steg
        </Button>
      </Group>
    </Stack>
  )
}

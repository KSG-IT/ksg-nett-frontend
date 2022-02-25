import { useMutation, useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card } from 'components/Card'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { DeleteMutationReturns, DeleteMutationVariables } from 'types/graphql'
import {
  CREATE_INTERVIEW_ADDITIONAL_EVALUATION_STATEMENT,
  CREATE_INTERVIEW_BOOLEAN_EVALUATION,
  DELETE_INTERVIEW_ADDITIONAL_EVALUATION_STATEMENT,
  DELETE_INTERVIEW_BOOLEAN_EVALUATION,
} from './mutations'
import { INTERVIEW_TEMPLATE_QUERY } from './queries'
import { InterviewTemplateReturns, WizardStage } from './types'
const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 900px;
`

const Title = styled.h1`
  margin: 0;
`
const StatementContainerTitle = styled.h2`
  margin: 0;
`

const StatementContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StatementRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
`

const NavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const AddStatementContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;
`

const DeleteIcon = styled(FontAwesomeIcon)`
  color: ${props => props.theme.colors.error};

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`
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
    <Wrapper>
      <Title>Intervjumal spørsmål</Title>
      <Card>
        <StatementContainer>
          <StatementContainerTitle>Ja/Nei spørsmål</StatementContainerTitle>
          {interviewBooleanEvaluationStatements.map(node => (
            <StatementRow key={node.id}>
              <span>{node.statement}</span>
              <DeleteIcon
                icon="trash-alt"
                size="sm"
                onClick={() =>
                  handleDeleteInterviewBooleanEvaluationStatements(node.id)
                }
              />
            </StatementRow>
          ))}
        </StatementContainer>
      </Card>
      <AddStatementContainer>
        <label>Legg til ja/nei spørsmål</label>
        <input
          value={interviewBooleanEvaluation}
          onChange={evt => setInterviewBooleanEvaluation(evt.target.value)}
        />
        <button onClick={handleCreateInterviewBooleanEvaluation}>
          Legg til
        </button>
      </AddStatementContainer>
      <Card>
        <StatementContainer>
          <StatementContainerTitle>Vurderingsspørsmål</StatementContainerTitle>
          {interviewAdditionalEvaluationStatements.map(node => (
            <StatementRow key={node.id}>
              <span>{node.statement}</span>
              <DeleteIcon
                icon="trash-alt"
                size="sm"
                onClick={() =>
                  handleDeleteInterviewAdditionalEvaluationStatements(node.id)
                }
              />
            </StatementRow>
          ))}
        </StatementContainer>
      </Card>
      <AddStatementContainer>
        <label>Vurderingsspørsmål</label>
        <input
          value={interviewAdditionalEvaluationStatement}
          onChange={evt =>
            setInterviewAdditionalEvaluationStatement(evt.target.value)
          }
        />
        <button onClick={handleCreateInterviewAdditionalEvaluationStatement}>
          Legg til
        </button>
      </AddStatementContainer>
      <NavigationContainer>
        <button
          onClick={() => setStageCallback('INTERVIEW_LOCATION_AVAILABILITY')}
        >
          Forrige steg
        </button>
        <button onClick={() => setStageCallback('AVAILABLE_POSITIONS')}>
          Neste steg
        </button>
      </NavigationContainer>
    </Wrapper>
  )
}

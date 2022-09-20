import { useMutation, useQuery } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Group, ScrollArea, Stack, Title } from '@mantine/core'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { format } from 'date-fns'
import { AdmissionStatusValues } from 'modules/admissions/consts'
import {
  DELETE_ALL_INTERVIEWS,
  GENERATE_INTERVIEWS,
  PATCH_ADMISSION,
} from 'modules/admissions/mutations'
import { INTERVIEW_OVERVIEW_QUERY } from 'modules/admissions/queries'
import {
  InterviewOverviewReturns,
  PatchAdmissionInput,
  PatchAdmissionReturns,
} from 'modules/admissions/types.graphql'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { PatchMutationVariables } from 'types/graphql'
import { InterviewLocationInterviewsCard } from './InterviewLocationInterviewsCard'

type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'

const InterviewLocationGroupingContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
`

const InterviewDayCard = styled.div`
  border-radius: 10px;
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadow.default};
  padding: 5px;
`

interface InterviewOverviewProps {
  setStageCallback: (stage: WizardStage) => void
}

interface GenerateInterviewsReturns {
  ok: boolean
  interviewsGenerated: number
}

export const InterviewOverview: React.VFC<InterviewOverviewProps> = ({
  setStageCallback,
}) => {
  const navigate = useNavigate()
  const { data, error, loading } = useQuery<InterviewOverviewReturns>(
    INTERVIEW_OVERVIEW_QUERY
  )

  const [generateInterviews] = useMutation<GenerateInterviewsReturns>(
    GENERATE_INTERVIEWS,
    {
      refetchQueries: ['InterviewOverviewQuery'],
      onCompleted: () => {
        toast.success('Genererte intervjuer!')
      },
    }
  )

  const [deleteAllInterviews] = useMutation(DELETE_ALL_INTERVIEWS, {
    refetchQueries: ['InterviewOverviewQuery'],
  })

  const [openAdmission] = useMutation<
    PatchAdmissionReturns,
    PatchMutationVariables<PatchAdmissionInput>
  >(PATCH_ADMISSION, { refetchQueries: ['ActiveAdmission'] })

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const handleGenerateInterviews = () => {
    toast.promise(generateInterviews(), {
      loading: 'Genererer intervjuer...',
      error: 'Noe gikk galt',
      success: 'Intervjuer generert',
    })
  }

  const {
    interviewOverview: { interviewDayGroupings, admissionId },
  } = data

  if (interviewDayGroupings.length === 0)
    return (
      <Stack p="lg">
        <Title>Genererte intervjuer</Title>
        <Group>
          <Button onClick={() => setStageCallback('AVAILABLE_POSITIONS')}>
            Forrige steg
          </Button>
          <Button onClick={handleGenerateInterviews}>
            Generer interjuer basert på innstillinger
          </Button>
        </Group>
      </Stack>
    )

  const handleOpenAdmission = () => {
    openAdmission({
      variables: {
        id: admissionId,
        input: { status: AdmissionStatusValues.OPEN },
      },
    }).then(() => navigate('/admissions'))
  }

  return (
    <ScrollArea style={{ width: '100%' }} p="lg">
      <Group>
        <Title my="md">Genererte intervjuer</Title>
        <Button
          leftIcon={<FontAwesomeIcon icon="trash" />}
          color="red"
          onClick={() => deleteAllInterviews()}
        >
          Slett intervjuene
        </Button>
      </Group>
      <MessageBox type="warning">
        <b>Obs!</b> Om du har endret på noen av den tidligere dataen må du
        slette intervjuene og generere de på nytt igjen!
      </MessageBox>
      <Stack>
        {interviewDayGroupings.map(interviewDayGroup => (
          <div key={format(new Date(interviewDayGroup.date), 'y-M-d')}>
            <h2>{format(new Date(interviewDayGroup.date), 'EEEE d LLLL')}</h2>
            <InterviewDayCard>
              <InterviewLocationGroupingContainer>
                {interviewDayGroup.locations.map(grouping => (
                  <InterviewLocationInterviewsCard
                    key={grouping.name}
                    interviewlocationGrouping={grouping}
                  />
                ))}
              </InterviewLocationGroupingContainer>
            </InterviewDayCard>
          </div>
        ))}
      </Stack>
      <Group>
        <Button onClick={() => setStageCallback('AVAILABLE_POSITIONS')}>
          Forrige steg
        </Button>
        <Button onClick={handleOpenAdmission}>Åpne opptaket</Button>
      </Group>
    </ScrollArea>
  )
}

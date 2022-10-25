import { useMutation, useQuery } from '@apollo/client'
import { Button, Card, Group, Stack, Title } from '@mantine/core'
import { IconTrash } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
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
import { PatchMutationVariables } from 'types/graphql'
import { format } from 'util/date-fns'
import { InterviewLocationInterviewsCard } from './InterviewLocationInterviewsCard'

type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'

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

  const [generateInterviews, { loading: generateLoading }] =
    useMutation<GenerateInterviewsReturns>(GENERATE_INTERVIEWS, {})

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
    generateInterviews({
      refetchQueries: [INTERVIEW_OVERVIEW_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Genererte intervjuer')
      },
    })
  }

  const {
    interviewOverview: { interviewDayGroupings, admissionId },
  } = data

  if (interviewDayGroupings.length === 0)
    return (
      <Stack>
        <Title>Genererte intervjuer</Title>
        <Group>
          <Button
            color="samfundet-red"
            onClick={() => setStageCallback('AVAILABLE_POSITIONS')}
          >
            Forrige steg
          </Button>
          <Button
            color="samfundet-red"
            onClick={handleGenerateInterviews}
            loading={generateLoading}
          >
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
      onCompleted() {
        toast.success('Åpnet opptaket')
        navigate('/admissions')
      },
    })
  }

  return (
    <Stack>
      <Group>
        <Title my="md">Genererte intervjuer</Title>
        <Button
          leftIcon={<IconTrash />}
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
            <Card>
              <Group>
                {interviewDayGroup.locations.map(grouping => (
                  <InterviewLocationInterviewsCard
                    key={grouping.name}
                    interviewlocationGrouping={grouping}
                  />
                ))}
              </Group>
            </Card>
          </div>
        ))}
      </Stack>
      <Group>
        <Button
          color="samfundet-red"
          onClick={() => setStageCallback('AVAILABLE_POSITIONS')}
        >
          Forrige steg
        </Button>
        <Button color="samfundet-red" onClick={handleOpenAdmission}>
          Åpne opptaket
        </Button>
      </Group>
    </Stack>
  )
}

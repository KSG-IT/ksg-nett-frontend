import { useMutation, useQuery } from '@apollo/client'
import { Button } from 'components/Button'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { format } from 'date-fns'
import { PATCH_ADMISSION } from 'modules/admissions/mutations'
import toast from 'react-hot-toast'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { PatchMutationVariables } from 'types/graphql'
import { INTERVIEW_OVERVIEW_QUERY } from '../queries'
import { PatchAdmissionInput, PatchAdmissionReturns } from '../types'
import { InterviewLocationInterviewsCard } from './InterviewLocationInterviewsCard'
import { DELETE_ALL_INTERVIEWS, GENERATE_INTERVIEWS } from './mutations'
import { InterviewOverviewReturns, WizardStage } from './types'
const Wrapper = styled.div`
  ${props => props.theme.layout.default};
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`

const Title = styled.h1`
  margin: 0;
`

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
  const history = useHistory()
  const { data, error, loading } = useQuery<InterviewOverviewReturns>(
    INTERVIEW_OVERVIEW_QUERY,
    {
      onCompleted(data) {
        history.push('admissions')
      },
    }
  )

  const [generateInterviews] = useMutation<GenerateInterviewsReturns>(
    GENERATE_INTERVIEWS,
    { refetchQueries: ['InterviewOverviewQuery'] }
  )

  const [deleteAllInterviews] = useMutation(DELETE_ALL_INTERVIEWS, {
    refetchQueries: ['InterviewOverviewQuery'],
    onCompleted() {
      toast.success('Alle intervjuer slettet')
    },
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
    interviewScheduleTemplate,
  } = data

  if (interviewDayGroupings.length === 0)
    return (
      <Wrapper>
        <Title>Genererte intervjuer</Title>
        <div>Oi, her var det tomt</div>
        <Button
          buttonStyle="cancel"
          onClick={() => setStageCallback('AVAILABLE_POSITIONS')}
        >
          Forrige steg
        </Button>
        <Button onClick={handleGenerateInterviews}>
          Generer interjuer basert på innstillinger
        </Button>
      </Wrapper>
    )

  const handleOpenAdmission = () => {
    openAdmission({ variables: { id: admissionId, input: { status: 'OPEN' } } })
  }

  return (
    <Wrapper>
      <Title>Genererte intervjuer</Title>
      <button onClick={() => deleteAllInterviews()}>Slett intervjuene</button>
      {interviewDayGroupings.map(interviewDayGroup => (
        <div key={format(new Date(interviewDayGroup.date), 'y-M-d')}>
          <h2>{format(new Date(interviewDayGroup.date), 'EEEE d LLLL')}</h2>
          <InterviewDayCard>
            <InterviewLocationGroupingContainer>
              {interviewDayGroup.locations.map(grouping => (
                <InterviewLocationInterviewsCard
                  key={grouping.name}
                  interviewlocationGrouping={grouping}
                  interviewScheduleTemplate={interviewScheduleTemplate}
                />
              ))}
            </InterviewLocationGroupingContainer>
          </InterviewDayCard>
        </div>
      ))}
      <Button
        buttonStyle="cancel"
        onClick={() => setStageCallback('AVAILABLE_POSITIONS')}
      >
        Forrige steg
      </Button>
      <Button onClick={handleOpenAdmission}>Åpne opptaket</Button>
    </Wrapper>
  )
}

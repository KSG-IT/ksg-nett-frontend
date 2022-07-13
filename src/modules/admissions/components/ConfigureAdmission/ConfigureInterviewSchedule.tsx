import { useQuery } from '@apollo/client'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import styled from 'styled-components'
import { INTERVIEW_SCHEDULE_TEMPLATE } from '../../queries'
import { AdmissionConfigForm } from './AdmissionConfigForm'
type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'
  | null

const Wrapper = styled.div`
  ${props => props.theme.layout.default};
`

const Title = styled.h1``

interface ConfigureInterviewScheduleProps {
  setStageCallback: (stage: WizardStage) => void
}

export const ConfigureInterviewSchedule: React.VFC<
  ConfigureInterviewScheduleProps
> = ({ setStageCallback }) => {
  const { data, loading, error } = useQuery(INTERVIEW_SCHEDULE_TEMPLATE)

  if (error) return <FullPageError />

  if (loading || !data) return <FullContentLoader />

  const { interviewScheduleTemplate: interviewSchedule } = data

  return (
    <Wrapper>
      <Title>Innstillinger intervjuperiode</Title>
      <AdmissionConfigForm
        interviewSchedule={interviewSchedule}
        setStageCallback={setStageCallback}
      />
    </Wrapper>
  )
}

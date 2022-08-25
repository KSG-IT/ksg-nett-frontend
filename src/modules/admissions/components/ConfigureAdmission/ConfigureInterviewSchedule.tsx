import styled from 'styled-components'
import { InterviewScheduleForm } from '../AdmissionConfiguration/InterviewScheduleForm'

type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'

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
  const nextStage = () => {
    setStageCallback('INTERVIEW_LOCATION_AVAILABILITY')
  }

  return (
    <Wrapper>
      <Title>Innstillinger intervjuperiode</Title>
      <InterviewScheduleForm
        // interviewSchedule={interviewSchedule}
        nextStageCallback={nextStage}
      />
    </Wrapper>
  )
}

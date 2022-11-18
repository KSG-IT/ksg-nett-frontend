import { Stack, Title } from '@mantine/core'
import { InterviewScheduleForm } from '../AdmissionConfiguration/InterviewScheduleForm'

type WizardStage =
  | 'START'
  | 'SCHEDULE'
  | 'INTERVIEW_LOCATION_AVAILABILITY'
  | 'INTERVIEW_TEMPLATE'
  | 'AVAILABLE_POSITIONS'
  | 'SUMMARY'

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
    <Stack>
      <Title>Innstillinger intervjuperiode</Title>
      <InterviewScheduleForm nextStageCallback={nextStage} />
    </Stack>
  )
}

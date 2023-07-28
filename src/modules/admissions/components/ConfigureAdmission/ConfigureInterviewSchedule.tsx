import { Stack, Title } from '@mantine/core'
import { InterviewScheduleForm } from '../AdmissionConfiguration/InterviewScheduleForm'
import { useQuery } from '@apollo/client'
import { INTERVIEW_SCHEDULE_TEMPLATE } from 'modules/admissions/queries'
import { showNotification } from '@mantine/notifications'

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
  const { data, loading } = useQuery(INTERVIEW_SCHEDULE_TEMPLATE, {
    onError({ message }) {
      showNotification({
        title: 'Noe gikk galt',
        message,
      })
    },
  })

  function nextStage() {
    setStageCallback('INTERVIEW_LOCATION_AVAILABILITY')
  }

  if (loading || !data) return null

  const { interviewScheduleTemplate } = data

  const defaultValues = {
    defaultBlockSize: interviewScheduleTemplate.defaultBlockSize,
    defaultInterviewDuration:
      interviewScheduleTemplate.defaultInterviewDuration,
    defaultPauseDuration: interviewScheduleTemplate.defaultPauseDuration,
    defaultInterviewDayStart:
      interviewScheduleTemplate.defaultInterviewDayStart,
    defaultInterviewDayEnd: interviewScheduleTemplate.defaultInterviewDayEnd,
    interviewPeriodStartDate: new Date(
      interviewScheduleTemplate.interviewPeriodStartDate
    ),
    interviewPeriodEndDate: new Date(
      interviewScheduleTemplate.interviewPeriodEndDate
    ),
  }

  return (
    <Stack>
      <Title>Innstillinger intervjuperiode</Title>
      <InterviewScheduleForm
        nextStageCallback={nextStage}
        interviewScheduleId={interviewScheduleTemplate.id}
        defaultValues={defaultValues}
      />
    </Stack>
  )
}

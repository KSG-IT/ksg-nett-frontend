import { useInterviewScheduleMutations } from 'modules/admissions/mutations.hooks'
import { INTERVIEW_SCHEDULE_TEMPLATE } from 'modules/admissions/queries'

interface UseInterviewScheduleAPIInput {
  interviewScheduleId: string
  defaultValues: {
    defaultInterviewDuration: string
    defaultPauseDuration: string
    defaultBlockSize: number
    defaultInterviewDayStart: string
    defaultInterviewDayEnd: string
    interviewPeriodStartDate: Date
    interviewPeriodEndDate: Date
  }
}
export function useInterviewScheduleAPI(input: UseInterviewScheduleAPIInput) {
  const { interviewScheduleId, defaultValues } = input
  const { patchInterviewSchedule } = useInterviewScheduleMutations()

  type MutationInput = {
    defaultBlockSize?: number
    defaultInterviewDuration?: string
    defaultPauseDuration?: string
    defaultInterviewDayStart?: string
    defaultInterviewDayEnd?: string
    interviewPeriodStartDate?: string
    interviewPeriodEndDate?: string
  }

  async function handleSubmit(mutationInput: MutationInput) {
    return patchInterviewSchedule({
      variables: { id: interviewScheduleId, input: { ...mutationInput } },
      refetchQueries: [INTERVIEW_SCHEDULE_TEMPLATE],
    })
  }

  return {
    defaultValues: defaultValues,
    onSubmit: handleSubmit,
  }
}

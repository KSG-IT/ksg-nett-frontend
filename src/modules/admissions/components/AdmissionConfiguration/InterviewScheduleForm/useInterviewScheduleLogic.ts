import { zodResolver } from '@hookform/resolvers/zod'
import {
  PatchInterviewScheduleTemplateReturns,
  PatchInterviewScheduleTemplateVariables,
} from 'modules/admissions/types.graphql'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import { requiredIsoDate, requiredString } from 'util/validation'
import { z } from 'zod'
import { showNotification } from '@mantine/notifications'

const InterviewScheduleSchema = z.object({
  interviewPeriodStartDate: requiredIsoDate('Startdato må fylles ut'),
  defaultInterviewDayStart: requiredString('Starttid må fylles ut'),
  interviewPeriodEndDate: requiredIsoDate('Sluttdato må fylles ut'),
  defaultInterviewDayEnd: requiredString('Sluttid må fylles ut'),
  defaultInterviewDuration: requiredString('Varighet må fylles ut'),
  defaultBlockSize: z.number({ error: 'Blokkstørrelse må fylles ut' }),
  defaultPauseDuration: requiredString('Pausevarighet må fylles ut'),
})

export type InterviewScheduleFormValues = z.input<
  typeof InterviewScheduleSchema
>
type InterviewScheduleFormData = z.output<typeof InterviewScheduleSchema>

interface InterviewScheduleLogicInput {
  defaultValues: InterviewScheduleFormValues
  onSubmit: OnFormSubmit<
    PatchInterviewScheduleTemplateVariables['input'],
    PatchInterviewScheduleTemplateReturns
  >
  nextStageCallback: () => void
}
export function useInterviewScheduleLogic({
  defaultValues,
  onSubmit,
  nextStageCallback,
}: InterviewScheduleLogicInput) {
  const form = useForm<
    InterviewScheduleFormValues,
    unknown,
    InterviewScheduleFormData
  >({
    mode: 'onSubmit',
    defaultValues: defaultValues,
    resolver: zodResolver(InterviewScheduleSchema),
  })

  async function handleSubmit(data: InterviewScheduleFormData) {
    const {
      defaultInterviewDuration,
      defaultPauseDuration,
      defaultInterviewDayStart,
      defaultInterviewDayEnd,
      ...rest
    } = data

    // The input in the actual mutation differs a bit from the form input.
    // We parse them to mutation field friendly strings.
    // TimeField -> HH:mm:ss
    const mutationData = {
      defaultInterviewDuration: `${defaultInterviewDuration}:00`,
      defaultPauseDuration: `${defaultPauseDuration}:00`,
      defaultInterviewDayStart: `${defaultInterviewDayStart}`,
      defaultInterviewDayEnd: `${defaultInterviewDayEnd}`,
      ...rest,
    }

    await onSubmit(mutationData)
      .then(() => nextStageCallback())
      .catch(err => {
        showNotification({
          title: 'Noe gikk galt',
          message: err.message,
        })
      })
  }

  return {
    form,
    onSubmit: handleSubmit,
  }
}

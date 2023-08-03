import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'util/date-fns'
import {
  PatchInterviewScheduleTemplateReturns,
  PatchInterviewScheduleTemplateVariables,
} from 'modules/admissions/types.graphql'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import * as yup from 'yup'
import { showNotification } from '@mantine/notifications'

export type InterviewScheduleFormData = {
  interviewPeriodStartDate: Date
  defaultInterviewDayStart: string
  interviewPeriodEndDate: Date
  defaultInterviewDayEnd: string
  defaultInterviewDuration: string
  defaultBlockSize: number
  defaultPauseDuration: string
}

const InterviewScheduleSchema = yup.object().shape({
  interviewPeriodStartDate: yup.date().required('Startdato må fylles ut'),
  defaultInterviewDayStart: yup.string().required('Starttid må fylles ut'),
  interviewPeriodEndDate: yup.date().required('Sluttdato må fylles ut'),
  defaultInterviewDayEnd: yup.string().required('Sluttid må fylles ut'),
  defaultInterviewDuration: yup.string().required('Varighet må fylles ut'),
  defaultBlockSize: yup.number().required('Blokkstørrelse må fylles ut'),
  defaultPauseDuration: yup.string().required('Pausevarighet må fylles ut'),
})

interface InterviewScheduleLogicInput {
  defaultValues: InterviewScheduleFormData
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
  const form = useForm<InterviewScheduleFormData>({
    mode: 'onSubmit',
    defaultValues: defaultValues,
    resolver: yupResolver(InterviewScheduleSchema),
  })

  async function handleSubmit(data: InterviewScheduleFormData) {
    const {
      defaultInterviewDuration,
      defaultPauseDuration,
      defaultInterviewDayStart,
      defaultInterviewDayEnd,
      interviewPeriodStartDate,
      interviewPeriodEndDate,
      ...rest
    } = data

    // The input in the actual mutation differs a bit from the form input.
    // We parse them to mutation field friendly strings.
    // TimeField -> HH:mm:ss
    // DateField -> YYYY-MM-DD
    const mutationData = {
      defaultInterviewDuration: `${defaultInterviewDuration}:00`,
      defaultPauseDuration: `${defaultPauseDuration}:00`,
      defaultInterviewDayStart: `${defaultInterviewDayStart}`,
      defaultInterviewDayEnd: `${defaultInterviewDayEnd}`,
      interviewPeriodStartDate: format(interviewPeriodStartDate, 'yyyy-MM-dd'),
      interviewPeriodEndDate: format(interviewPeriodEndDate, 'yyyy-MM-dd'),
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

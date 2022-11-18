import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'util/date-fns'
import {
  PatchInterviewScheduleTemplateReturns,
  PatchInterviewScheduleTemplateVariables,
} from 'modules/admissions/types.graphql'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { OnFormSubmit } from 'types/forms'
import * as yup from 'yup'

export type InterviewScheduleFormData = {
  interviewPeriodStartDate: Date
  defaultInterviewDayStart: Date
  interviewPeriodEndDate: Date
  defaultInterviewDayEnd: Date
  defaultInterviewDuration: Date
  defaultBlockSize: number
  defaultPauseDuration: Date
}

const InterviewScheduleSchema = yup.object().shape({
  interviewPeriodStartDate: yup.date().required('Startdato må fylles ut'),
  defaultInterviewDayStart: yup.date().required('Starttid må fylles ut'),
  interviewPeriodEndDate: yup.date().required('Sluttdato må fylles ut'),
  defaultInterviewDayEnd: yup.date().required('Sluttid må fylles ut'),
  defaultInterviewDuration: yup.date().required('Varighet må fylles ut'),
  defaultBlockSize: yup.number().required('Blokkstørrelse må fylles ut'),
  defaultPauseDuration: yup.date().required('Pausevarighet må fylles ut'),
})

interface InterviewScheduleLogicInput {
  defaultValues: InterviewScheduleFormData
  dataLoading: boolean
  onSubmit: OnFormSubmit<
    PatchInterviewScheduleTemplateVariables['input'],
    PatchInterviewScheduleTemplateReturns
  >
  nextStageCallback: () => void
}
export function useInterviewScheduleLogic({
  defaultValues,
  dataLoading,
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
      defaultInterviewDuration: `${format(
        defaultInterviewDuration,
        'HH:mm'
      )}:00`,
      defaultPauseDuration: `${format(defaultPauseDuration, 'HH:mm')}:00`,
      defaultInterviewDayStart: format(defaultInterviewDayStart, 'HH:mm:ss'),
      defaultInterviewDayEnd: format(defaultInterviewDayEnd, 'HH:mm:ss'),
      interviewPeriodStartDate: format(interviewPeriodStartDate, 'yyyy-MM-dd'),
      interviewPeriodEndDate: format(interviewPeriodEndDate, 'yyyy-MM-dd'),
      ...rest,
    }

    await onSubmit(mutationData)
      .then(() => nextStageCallback())
      .catch(err => {
        toast.error(err.message)
      })
  }

  useEffect(() => {
    if (dataLoading) return

    form.reset(defaultValues)
  }, [defaultValues])

  return {
    form,
    dataLoading,
    onSubmit: handleSubmit,
  }
}

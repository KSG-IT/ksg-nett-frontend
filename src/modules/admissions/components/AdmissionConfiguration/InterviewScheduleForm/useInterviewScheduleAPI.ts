import { useQuery } from '@apollo/client'
import { useInterviewScheduleMutations } from 'modules/admissions/mutations.hooks'
import { INTERVIEW_SCHEDULE_TEMPLATE } from 'modules/admissions/queries'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { InterviewScheduleFormData } from './useInterviewScheduleLogic'

function transform() {}

export function useInterviewScheduleAPI() {
  const { patchInterviewSchedule } = useInterviewScheduleMutations()
  const [scheduleId, setScheduleId] = useState<string>('')

  const { data, loading } = useQuery(INTERVIEW_SCHEDULE_TEMPLATE, {
    onCompleted(data) {
      setScheduleId(data.interviewScheduleTemplate.id)
    },
    onError(err) {
      toast.error('Kunne ikke hente intervjuplan')
    },
  })

  type MutationInput = {
    defaultBlockSize: number
    defaultInterviewDuration: string
    defaultPauseDuration: string
    defaultInterviewDayStart: string
    defaultInterviewDayEnd: string
    interviewPeriodStartDate: string
    interviewPeriodEndDate: string
  }

  async function handleSubmit(mutationInput: MutationInput) {
    return patchInterviewSchedule({
      variables: { id: scheduleId, input: { ...mutationInput } },
      refetchQueries: [INTERVIEW_SCHEDULE_TEMPLATE],
    })
  }

  function getHoursAndMinutesFromString(time: string) {
    const [hours, minutes] = time.split(':')

    return [parseInt(hours), parseInt(minutes)]
  }

  const parsedDefaultValues = useMemo(() => {
    // There is some wonky time conversion because we get a string from the backend
    // but we want to parse it to a date value to be used in the form
    if (!data) {
      // THis is less than ideal probably
      return {} as InterviewScheduleFormData
    }
    const interviewScheduleTemplate = data.interviewScheduleTemplate

    const timeValues: Omit<
      InterviewScheduleFormData,
      'interviewPeriodEndDate' | 'interviewPeriodStartDate' | 'defaultBlockSize'
    > = {
      defaultInterviewDuration:
        interviewScheduleTemplate.defaultInterviewDuration,
      defaultPauseDuration: interviewScheduleTemplate.defaultPauseDuration,
      defaultInterviewDayStart:
        interviewScheduleTemplate.defaultInterviewDayStart,
      defaultInterviewDayEnd: interviewScheduleTemplate.defaultInterviewDayEnd,
    }

    type Parsed = keyof typeof timeValues
    const parsedTimeValaues = Object.keys(timeValues).reduce((acc, key) => {
      const [hours, minutes] = getHoursAndMinutesFromString(
        timeValues[key as Parsed] as unknown as string
      )
      const date = new Date()
      date.setHours(hours, minutes, 0, 0)
      return {
        ...acc,
        [key]: date,
      }
    }, {} as InterviewScheduleFormData)

    console.log(interviewScheduleTemplate.interviewPeriodEndDate)
    return {
      ...parsedTimeValaues,
      interviewPeriodStartDate: new Date(
        interviewScheduleTemplate.interviewPeriodStartDate
      ),
      interviewPeriodEndDate: new Date(
        interviewScheduleTemplate.interviewPeriodEndDate
      ),
      defaultBlockSize: interviewScheduleTemplate.defaultBlockSize,
    }
  }, [data])
  // console.table(parsedDefaultValues)

  return {
    defaultValues: parsedDefaultValues,
    dataLoading: loading || !data,
    onSubmit: handleSubmit,
  }
}

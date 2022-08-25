import { Button, Group, Loader, NumberInput } from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { useInterviewScheduleAPI } from './useInterviewScheduleAPI'
import { useInterviewScheduleLogic } from './useInterviewScheduleLogic'

interface InterviewScheduleFormProps {
  nextStageCallback: () => void
}

export const InterviewScheduleForm: React.FC<InterviewScheduleFormProps> = ({
  nextStageCallback,
}) => {
  const { form, dataLoading, onSubmit } = useInterviewScheduleLogic({
    ...useInterviewScheduleAPI(),
    nextStageCallback,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = form

  if (dataLoading) {
    return <Loader />
  }
  console.table(getValues())

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TimeInput
        // For some reason the ...register() method does not play nice with the
        // time input, so we do this manually
        value={getValues('defaultInterviewDuration')}
        label="Standard intervjulengde"
        error={errors?.defaultInterviewDuration?.message}
        onChange={value => setValue('defaultInterviewDuration', value)}
      />
      <TimeInput
        value={getValues('defaultPauseDuration')}
        label="Standard pauselengde"
        description="Hvor lang er pausen mellom tidsbolker med intervjuer"
        error={errors?.defaultPauseDuration?.message}
        onChange={value => setValue('defaultPauseDuration', value)}
      />
      <NumberInput
        value={getValues('defaultBlockSize')}
        placeholder="5"
        label="Antall intervjuer på rad"
        description="Hvor mange intervjuer på rad før man har en pause"
        error={errors?.defaultBlockSize?.message}
        {...register('defaultBlockSize')}
      />
      <TimeInput
        value={getValues('defaultInterviewDayStart')}
        label="Standard intervjustart"
        description="Tidspunkt på dagen intervjuene starter"
        error={errors?.defaultInterviewDayStart?.message}
        onChange={date => {
          setValue('defaultInterviewDayStart', date)
        }}
      />
      <TimeInput
        value={getValues('defaultInterviewDayEnd')}
        label="Standard intervjuslutt"
        description="Seneste tidspunkt intervjuene kan holde på en dag"
        error={errors?.defaultInterviewDayEnd?.message}
        onChange={date => {
          setValue('defaultInterviewDayEnd', date)
        }}
      />
      <DatePicker
        // The value is not displayed even when its registered, but the value
        // is actually set in the form
        placeholder="Velg dato"
        label="Intervjuperiode stardato"
        error={errors?.interviewPeriodStartDate?.message}
        {...register('interviewPeriodStartDate')}
      />
      <DatePicker
        // Same as above
        placeholder="Velg dato"
        label="Intervjuperiode sluttdato"
        error={errors?.interviewPeriodEndDate?.message}
        {...register('interviewPeriodEndDate')}
      />
      <Group align="flex-end">
        <Button type="submit">Lagre innstillinger</Button>
      </Group>
    </form>
  )
}

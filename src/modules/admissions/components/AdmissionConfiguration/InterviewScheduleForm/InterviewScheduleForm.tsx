import { Button, Group, Loader, NumberInput, SimpleGrid } from '@mantine/core'
import { DateInput, TimeInput } from '@mantine/dates'
import { Controller } from 'react-hook-form'
import { useIsMobile } from 'util/hooks'
import { useInterviewScheduleAPI } from './useInterviewScheduleAPI'
import { useInterviewScheduleLogic } from './useInterviewScheduleLogic'

interface InterviewScheduleFormProps {
  nextStageCallback: () => void
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

export const InterviewScheduleForm: React.FC<InterviewScheduleFormProps> = ({
  nextStageCallback,
  interviewScheduleId,
  defaultValues,
}) => {
  const isMobile = useIsMobile()
  const { form, onSubmit } = useInterviewScheduleLogic({
    ...useInterviewScheduleAPI({
      interviewScheduleId,
      defaultValues,
    }),
    nextStageCallback,
  })

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SimpleGrid cols={isMobile ? 1 : 2}>
        <TimeInput
          label="Standard intervjulengde"
          description="Hvor lang tid er satt av per intervju. Dette er inkludert intervju, diskusjon og
          å flytte seg til nytt lokale"
          error={errors?.defaultInterviewDuration?.message}
          {...register('defaultInterviewDuration')}
        />
        <TimeInput
          label="Standard pauselengde"
          description="Hvor lang er pausen mellom tidsbolker med intervjuer"
          error={errors?.defaultPauseDuration?.message}
          {...register('defaultPauseDuration')}
        />
        <NumberInput
          value={getValues('defaultBlockSize')}
          placeholder="5"
          label="Antall intervjuer på rad"
          description="Hvor mange intervjuer på rad før man har en pause"
          error={errors?.defaultBlockSize?.message}
          onChange={num => num && setValue('defaultBlockSize', num)}
        />
        <div></div>
        <TimeInput
          label="Standard intervjustart"
          description="Tidspunkt på dagen intervjuene starter"
          error={errors?.defaultInterviewDayStart?.message}
          {...register('defaultInterviewDayStart')}
        />
        <TimeInput
          label="Standard intervjuslutt"
          description="Seneste tidspunkt intervjuene kan holde på en dag"
          error={errors?.defaultInterviewDayEnd?.message}
          {...register('defaultInterviewDayEnd')}
        />

        <Controller
          control={control}
          name="interviewPeriodStartDate"
          render={({ field }) => (
            <DateInput
              label="Startdato for intervjuperioden"
              description="Dagen de første intervjuene starter"
              error={errors?.interviewPeriodStartDate?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="interviewPeriodEndDate"
          render={({ field }) => (
            <DateInput
              label="Sluttdato for intervjuperioden"
              description="Dagen de siste intervjuene holdes"
              error={errors?.interviewPeriodEndDate?.message}
              {...field}
            />
          )}
        />
      </SimpleGrid>
      <Group my="sm">
        <Button color="samfundet-red" type="submit">
          Lagre innstillinger
        </Button>
      </Group>
    </form>
  )
}

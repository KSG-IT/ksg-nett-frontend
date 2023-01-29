import {
  Button,
  Group,
  Loader,
  NumberInput,
  SimpleGrid,
  Stack,
} from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { useMediaQuery } from 'util/hooks'
import { useInterviewScheduleAPI } from './useInterviewScheduleAPI'
import { useInterviewScheduleLogic } from './useInterviewScheduleLogic'

interface InterviewScheduleFormProps {
  nextStageCallback: () => void
}

export const InterviewScheduleForm: React.FC<InterviewScheduleFormProps> = ({
  nextStageCallback,
}) => {
  const isMobile = useMediaQuery('(max-width: 600px)')
  const { form, dataLoading, onSubmit } = useInterviewScheduleLogic({
    ...useInterviewScheduleAPI(),
    nextStageCallback,
  })

  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = form

  if (dataLoading) {
    return <Loader />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SimpleGrid cols={isMobile ? 1 : 2}>
        <TimeInput
          // For some reason the ...register() method does not play nice with the
          // time input, so we do this manually
          value={getValues('defaultInterviewDuration')}
          label="Standard intervjulengde"
          description="Hvor lang tid er satt av per intervju. Dette er inkludert intervju, diskusjon og
          å flytte seg til nytt lokale"
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
          onChange={num => num && setValue('defaultBlockSize', num)}
        />
        <div></div>
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
          placeholder="Velg dato"
          label="Intervjuperiode stardato"
          error={errors?.interviewPeriodStartDate?.message}
          value={getValues('interviewPeriodStartDate')}
          onChange={date => date && setValue('interviewPeriodStartDate', date)}
        />
        <DatePicker
          placeholder="Velg dato"
          label="Intervjuperiode sluttdato"
          error={errors?.interviewPeriodEndDate?.message}
          value={getValues('interviewPeriodEndDate')}
          onChange={date => date && setValue('interviewPeriodEndDate', date)}
        />
      </SimpleGrid>
      <Group my="sm">
        <Button type="submit">Lagre innstillinger</Button>
      </Group>
    </form>
  )
}

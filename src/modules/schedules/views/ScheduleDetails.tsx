import { useQuery } from '@apollo/client'
import {
  Button,
  Card,
  createStyles,
  Group,
  NumberInput,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconRefresh } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'util/date-fns'
import { ApplyScheduleTemplateModal } from '../components/ScheduleDetails'
import { ShiftRenderer } from '../components/ScheduleDetails/ShiftRenderer'
import { SCHEDULE_QUERY } from '../queries'

interface ScheduleDetailsParams {
  id: string
}

export const ScheduleDetails: React.FC = () => {
  const { classes } = useScheduleDetailsStyles()
  const { id } = useParams<
    keyof ScheduleDetailsParams
  >() as ScheduleDetailsParams

  const [modalOpen, setModalOpen] = useState(false)

  const [shiftsFrom, setShiftsFrom] = useState<Date>(new Date())
  const [numberOfWeeks, setNumberOfWeeks] = useState(2)

  const { data, loading, error } = useQuery(SCHEDULE_QUERY, {
    variables: {
      id,
      shiftsFrom: format(shiftsFrom, 'yyyy-MM-dd'),
      numberOfWeeks,
    },
  })

  if (error) {
    return <FullPageError />
  }

  if (loading || !data) {
    return <FullContentLoader />
  }

  const { schedule } = data
  const { displayMode } = schedule

  return (
    <div className={classes.wrapper}>
      <Title className={classes.title}>Vaktplan {schedule.name}</Title>

      <Card className={classes.controls} shadow="sm">
        <Group position="apart" align={'flex-end'}>
          <Group align={'flex-end'}>
            <DatePicker
              label={'Uke'}
              value={shiftsFrom}
              onChange={val => val && setShiftsFrom(val)}
            />
            <NumberInput
              label="Antall uker"
              value={numberOfWeeks}
              onChange={val => val && setNumberOfWeeks(val)}
            />
            <Stack spacing={0}>
              <label>Visningsmodus</label>
              <Text weight="bold">{displayMode}</Text>
            </Stack>
          </Group>
          <Button onClick={() => setModalOpen(true)}>
            Generer vakter fra mal
          </Button>
        </Group>
      </Card>

      <div className={classes.shifts}>
        <ShiftRenderer
          schedule={schedule}
          shiftsFrom={shiftsFrom}
          numberOfWeeks={numberOfWeeks}
        />
      </div>
      <ApplyScheduleTemplateModal
        isOpen={modalOpen}
        onCloseCallback={() => setModalOpen(false)}
      />
    </div>
  )
}

const useScheduleDetailsStyles = createStyles(theme => ({
  wrapper: {
    display: 'grid',
    gridTemplateAreas: `
      "title ."
      "controls controls"
      "shifts shifts"
    `,
    gap: theme.spacing.md,
  },
  title: {
    gridArea: 'title',
  },
  controls: {
    gridArea: 'controls',
  },
  shifts: {
    gridArea: 'shifts',
    display: 'flex',
    flexDirection: 'column',
  },
}))

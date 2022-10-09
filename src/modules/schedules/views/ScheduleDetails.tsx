import { useQuery } from '@apollo/client'
import { Button, createStyles, Group, Stack, Title } from '@mantine/core'

import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { add } from 'date-fns'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ApplyScheduleTemplateModal,
  WeekController,
} from '../components/ScheduleDetails'
import { CreateShiftModal } from '../components/ScheduleDetails/CreateShiftModal'
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
  const [applyTemplateModalOpen, setApplyTemplateModalOpen] = useState(false)
  const [createShiftModalOpen, setCreateShiftModalOpen] = useState(false)
  const [shiftsFrom, setShiftsFrom] = useState<Date>(new Date())
  const [numberOfWeeks, setNumberOfWeeks] = useState(2)

  const { data, loading, error } = useQuery(SCHEDULE_QUERY, {
    variables: {
      id,
    },
  })

  if (error) {
    return <FullPageError />
  }

  if (loading || !data) {
    return <FullContentLoader />
  }

  function handleNextWeek() {
    setShiftsFrom(date => add(date, { weeks: 1 }))
  }

  function handlePreviousWeek() {
    setShiftsFrom(date => add(date, { weeks: -1 }))
  }

  const { schedule } = data
  return (
    <Stack>
      <Group position="apart">
        <Group position="apart">
          <Title>Vaktplan {schedule.name}</Title>
          <WeekController
            week={shiftsFrom}
            previousWeekCallback={handlePreviousWeek}
            nextWeekCallback={handleNextWeek}
          />
        </Group>
        <Button onClick={() => setApplyTemplateModalOpen(true)}>
          Generer vakter fra mal
        </Button>
      </Group>

      <div className={classes.shifts}>
        <ShiftRenderer
          schedule={schedule}
          shiftsFrom={shiftsFrom}
          numberOfWeeks={numberOfWeeks}
        />
      </div>
      <ApplyScheduleTemplateModal
        isOpen={applyTemplateModalOpen}
        onCloseCallback={() => setApplyTemplateModalOpen(false)}
      />
      <CreateShiftModal
        isOpen={createShiftModalOpen}
        onCloseCallback={() => setCreateShiftModalOpen(false)}
      />
    </Stack>
  )
}

const useScheduleDetailsStyles = createStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',

    gap: theme.spacing.md,
  },

  shifts: {
    gridArea: 'shifts',
    display: 'flex',
    flexDirection: 'column',
  },
}))

import { useQuery } from '@apollo/client'
import { Button, createStyles, Group, Stack, Title } from '@mantine/core'
import { IconPlus, IconSettings } from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'

import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { add } from 'date-fns'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ApplyScheduleTemplateModal,
  ScheduleSettingsModal,
  WeekController,
} from '../components/ScheduleDetails'
import { CreateShiftDrawer } from '../components/ScheduleDetails/CreateShiftDrawer'

import { ShiftRenderer } from '../components/ScheduleDetails/ShiftRenderer'
import { SCHEDULE_QUERY } from '../queries'
const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Vaktlister', path: '/schedules' },
]

interface ScheduleDetailsParams {
  id: string
}

export const ScheduleDetails: React.FC = () => {
  const { classes } = useScheduleDetailsStyles()
  const { id } = useParams<
    keyof ScheduleDetailsParams
  >() as ScheduleDetailsParams
  const [applyTemplateModalOpen, setApplyTemplateModalOpen] = useState(false)
  const [createShiftDrawerOpen, setCreateShiftDrawerOpen] = useState(false)
  const [scheduleSettingsModalOpen, setScheduleSettingsModalOpen] =
    useState(false)
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

  const overloadedBreadcrumbs = [
    ...breadcrumbsItems,
    { label: schedule.name, path: `` },
  ]
  return (
    <Stack>
      <Breadcrumbs items={overloadedBreadcrumbs} />
      <Group position="apart">
        <Group position="apart">
          <Title>Vaktplan {schedule.name}</Title>
          <WeekController
            week={shiftsFrom}
            previousWeekCallback={handlePreviousWeek}
            nextWeekCallback={handleNextWeek}
          />

          <Button
            color="samfundet-red"
            leftIcon={<IconSettings />}
            onClick={() => setScheduleSettingsModalOpen(true)}
          >
            Innstillinger
          </Button>
        </Group>
        <Group>
          <Button
            leftIcon={<IconPlus />}
            onClick={() => setCreateShiftDrawerOpen(true)}
          >
            {' '}
            Nytt skift
          </Button>
          <Button
            color="samfundet-red"
            onClick={() => setApplyTemplateModalOpen(true)}
          >
            Generer vakter fra mal
          </Button>
        </Group>
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

      <ScheduleSettingsModal
        isOpen={scheduleSettingsModalOpen}
        schedule={schedule}
        onCloseCallback={() => setScheduleSettingsModalOpen(false)}
      />
      <CreateShiftDrawer
        scheduleId={schedule.id}
        size="xl"
        padding="md"
        title="Opprett nytt skift"
        opened={createShiftDrawerOpen}
        onClose={() => setCreateShiftDrawerOpen(false)}
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

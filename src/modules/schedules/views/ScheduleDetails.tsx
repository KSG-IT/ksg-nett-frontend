import { useQuery } from '@apollo/client'
import {
  Button,
  Container,
  createStyles,
  Group,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'

import { IconChevronLeft, IconChevronRight, IconPlus } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { add } from 'date-fns'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'util/date-fns'
import { ApplyScheduleTemplateModal } from '../components/ScheduleDetails'
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
    <div className={classes.wrapper}>
      <Group className={classes.controls} align={'baseline'}>
        <Group position="apart">
          <Title className={classes.title}>Vaktplan {schedule.name}</Title>
          <Group
            className={classes.weekController}
            spacing={0}
            align={'center'}
          >
            <UnstyledButton
              className={classes.weekControllerButton}
              onClick={handlePreviousWeek}
            >
              <IconChevronLeft />
            </UnstyledButton>
            <Container>
              <Text>Uke {format(shiftsFrom, 'w')}</Text>
            </Container>
            <UnstyledButton
              className={classes.weekControllerButton}
              onClick={handleNextWeek}
            >
              <IconChevronRight />
            </UnstyledButton>
          </Group>
          <Button
            leftIcon={<IconPlus />}
            onClick={() => setCreateShiftModalOpen(true)}
          >
            Legg til nytt skift
          </Button>
          <Button onClick={() => setApplyTemplateModalOpen(true)}>
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
      <CreateShiftModal
        isOpen={createShiftModalOpen}
        onCloseCallback={() => setCreateShiftModalOpen(false)}
      />
    </div>
  )
}

const useScheduleDetailsStyles = createStyles(theme => ({
  wrapper: {
    display: 'grid',
    gridTemplateAreas: `
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
  weekController: {
    backgroundColor: 'white',
    border: '1px solid gray',
    borderRadius: '5px',
    'button:first-of-type': {
      borderRight: '1px solid gray',
    },
    'button:last-of-type': {
      borderLeft: '1px solid gray',
    },
  },
  weekControllerButton: {
    ':hover': {
      cursor: 'pointer',
    },
  },
}))

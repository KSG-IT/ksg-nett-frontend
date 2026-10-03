import { Button, Paper, Progress, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import { planStatus, slotStatus } from '../../schedulesOverview'
import { ScheduleOverviewNode } from '../../types.graphql'
import { LocationBadge } from '../LocationBadge'
import classes from './ScheduleOverviewList.module.css'

interface ScheduleOverviewListProps {
  schedules: ScheduleOverviewNode[]
}

export const ScheduleOverviewList: React.FC<ScheduleOverviewListProps> = ({
  schedules,
}) => {
  const now = new Date()
  return (
    <Paper withBorder radius="md" className={classes.list}>
      {schedules.map(schedule => (
        <ScheduleOverviewRow key={schedule.id} schedule={schedule} now={now} />
      ))}
    </Paper>
  )
}

interface ScheduleOverviewRowProps {
  schedule: ScheduleOverviewNode
  now: Date
}

const ScheduleOverviewRow: React.FC<ScheduleOverviewRowProps> = ({
  schedule,
  now,
}) => (
  <div className={classes.row}>
    <div className={classes.name}>
      <Text fw={700} component={Link} to={schedule.id} className={classes.link}>
        {schedule.name}
      </Text>
      <ScheduleLocations locations={schedule.recentLocations} />
    </div>
    <PlannedUntil plannedUntil={schedule.plannedUntil} now={now} />
    <UpcomingSlots slots={schedule.upcomingSlots} />
    <Button
      component={Link}
      to={schedule.id}
      variant="default"
      size="xs"
      className={classes.open}
    >
      Åpne
    </Button>
  </div>
)

interface ScheduleLocationsProps {
  locations: ScheduleOverviewNode['recentLocations']
}

const ScheduleLocations: React.FC<ScheduleLocationsProps> = ({ locations }) =>
  locations.length === 0 ? (
    <Text size="xs" c="dimmed">
      Ingen vakter de siste ukene
    </Text>
  ) : (
    <div className={classes.locations}>
      {locations.map(location => (
        <LocationBadge key={location} location={location} size="xs" />
      ))}
    </div>
  )

interface PlannedUntilProps {
  plannedUntil: string | null
  now: Date
}

const PlannedUntil: React.FC<PlannedUntilProps> = ({ plannedUntil, now }) => {
  const status = planStatus(plannedUntil, now)
  if (!status) {
    return (
      <Text size="sm" c="dimmed" className={classes.planned}>
        Ingen kommende vakter
      </Text>
    )
  }
  return (
    <div className={classes.planned}>
      <Text size="sm" fw={600} c={status.soon ? 'orange.8' : undefined}>
        {status.label}
      </Text>
      <Text size="xs" c="dimmed">
        {status.days === 0 ? 'i dag' : `om ${status.days} dager`}
      </Text>
    </div>
  )
}

interface UpcomingSlotsProps {
  slots: ScheduleOverviewNode['upcomingSlots']
}

const UpcomingSlots: React.FC<UpcomingSlotsProps> = ({ slots }) => {
  const { open, percent } = slotStatus(slots)
  if (slots.total === 0) {
    return (
      <Text size="xs" c="dimmed" className={classes.slots}>
        Neste 14 dager: ingen vakter
      </Text>
    )
  }
  return (
    <div className={classes.slots}>
      <Text size="xs" c="dimmed">
        Neste 14 dager:{' '}
        <Text span inherit fw={700} c="dark">
          {slots.filled} av {slots.total}
        </Text>{' '}
        fylt
        {open > 0 && (
          <Text span inherit fw={700} c="orange.8">
            {' '}
            · {open} ledige
          </Text>
        )}
      </Text>
      <Progress
        value={percent}
        size="sm"
        color={open > 0 ? 'orange' : 'green'}
        aria-label={`${percent} % fylt`}
      />
    </div>
  )
}

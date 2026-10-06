import { useQuery } from '@apollo/client'
import { Button, Text, ThemeIcon } from '@mantine/core'
import { IconAlarm, IconCalendarEvent } from '@tabler/icons-react'
import { parseISO } from 'date-fns'
import { Link } from 'react-router-dom'
import { format } from 'util/date-fns'
import { planningBanner, weekRange } from '../availability'
import { MY_OPEN_PLANNING_PERIODS_SUMMARY_QUERY } from '../queries'
import type { MyOpenPlanningPeriodsSummaryReturns } from '../types.graphql'
import classes from './PlanningAvailabilityBanner.module.css'

type Period = MyOpenPlanningPeriodsSummaryReturns['myOpenPlanningPeriods'][0]

// Mockup 1 in the "Vaktplanlegging mockups" canvas
export const PlanningAvailabilityBanner: React.FC = () => {
  const { data } = useQuery<MyOpenPlanningPeriodsSummaryReturns>(
    MY_OPEN_PLANNING_PERIODS_SUMMARY_QUERY,
    { pollInterval: 30_000 }
  )
  const period = [...(data?.myOpenPlanningPeriods ?? [])]
    .filter(period => planningBanner(period))
    .sort((a, b) => a.deadline.localeCompare(b.deadline))[0]
  const banner = period && planningBanner(period)

  if (!period || !banner) return null

  const deadline = parseISO(period.deadline)
  const name = `${period.schedule.name}, ${weekRange(
    period.dateFrom,
    period.dateTo
  )}`
  const to = `/schedules/me/availability?period=${period.id}`

  if (!banner.urgent) {
    return (
      <div className={classes.banner}>
        <ThemeIcon size={40} radius="md" variant="light">
          <IconCalendarEvent size={20} />
        </ThemeIcon>
        <div className={classes.text}>
          <Text fw={700} size="md">
            Oppgi tilgjengelighet for {name}
          </Text>
          <Text size="sm" c="dimmed">
            Frist {format(deadline, 'EEEE d. MMM')}.{' '}
            {banner.optIn
              ? 'Du får bare vakter du melder deg på.'
              : 'Du står som tilgjengelig til du endrer noe.'}
          </Text>
        </div>
        <Button component={Link} to={to}>
          Åpne
        </Button>
      </div>
    )
  }

  return (
    <div className={`${classes.banner} ${classes.urgent}`}>
      <ThemeIcon size={40} radius="md" variant="light" color="orange">
        <IconAlarm size={20} />
      </ThemeIcon>
      <div className={classes.text}>
        <Text fw={700} size="md">
          Frist {banner.urgent === 'TODAY' ? 'i dag' : 'i morgen'}: {name}
        </Text>
        <Text size="sm" className={classes.urgentBody}>
          {urgentBody(period, banner.hasChanges, banner.optIn, deadline)}
        </Text>
      </div>
      <Button
        component={Link}
        to={to}
        variant="outline"
        color="orange"
        className={classes.urgentAction}
      >
        Se over
      </Button>
    </div>
  )
}

function urgentBody(
  period: Period,
  hasChanges: boolean,
  optIn: boolean,
  deadline: Date
) {
  if (hasChanges) {
    return `Se over svarene dine før fristen kl. ${format(deadline, 'HH:mm')}.`
  }
  if (optIn) return 'Du har ikke meldt deg på noen vakter.'
  return `Du har ikke endret noe. Stemmer det at du kan ta alle de ${period.shifts.length} vaktene?`
}

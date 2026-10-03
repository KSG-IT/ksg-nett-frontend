import { useQuery } from '@apollo/client'
import { Group, SegmentedControl, Stack, Title } from '@mantine/core'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { useMatch, useNavigate } from 'react-router-dom'
import { useIsMobile, useMe } from 'util/hooks'
import { DayShift } from '../allShifts'
import {
  CalendarSubscribeButton,
  MyShiftList,
  NextShiftCard,
} from '../components/MyShifts'
import {
  groupByMonth,
  groupByWeek,
  pastShifts,
  upcomingShifts,
} from '../myShifts'
import { MY_SHIFTS_PAST, MY_SHIFTS_UPCOMING } from '../queries'
import { MyShiftsPastReturns, MyShiftsUpcomingReturns } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Vakter', path: '/schedules/all-shifts' },
  { label: 'Mine vakter', path: '' },
]

const UPCOMING_PATH = '/schedules/me'
const PAST_PATH = '/schedules/me/history'

// One page for /schedules/me (Kommende) and /schedules/me/history
// (Tidligere), so old links still work.
export const MyShifts: React.FC = () => {
  const me = useMe()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const showPast = useMatch(PAST_PATH) !== null

  // The count in the Kommende tab needs this query on both tabs.
  const upcoming = useQuery<MyShiftsUpcomingReturns>(MY_SHIFTS_UPCOMING, {
    pollInterval: 30_000,
  })
  const past = useQuery<MyShiftsPastReturns>(MY_SHIFTS_PAST, {
    skip: !showPast,
  })

  const upcomingList = upcomingShifts(upcoming.data?.myUpcomingShifts ?? [])

  function handleTabChange(value: string) {
    navigate(value)
  }

  return (
    <Stack gap="md" maw={900}>
      <Breadcrumbs items={breadcrumbsItems} />
      <Group justify="space-between" wrap="wrap" gap="sm">
        <Title order={1}>Mine vakter</Title>
        <Group gap="xs">
          <SegmentedControl
            value={showPast ? PAST_PATH : UPCOMING_PATH}
            onChange={handleTabChange}
            data={[
              {
                label: `Kommende ${upcomingList.length || ''}`.trim(),
                value: UPCOMING_PATH,
              },
              { label: 'Tidligere', value: PAST_PATH },
            ]}
          />
          <CalendarSubscribeButton
            icalToken={me.icalToken}
            compact={isMobile}
          />
        </Group>
      </Group>
      {showPast ? (
        <PastShifts
          shifts={past.data?.allMyShifts}
          loading={past.loading}
          failed={!!past.error}
          meId={me.id}
        />
      ) : (
        <UpcomingShifts
          shifts={upcomingList}
          loading={upcoming.loading && !upcoming.data}
          failed={!!upcoming.error}
          meId={me.id}
        />
      )}
    </Stack>
  )
}

interface UpcomingShiftsProps {
  shifts: DayShift[]
  loading: boolean
  failed: boolean
  meId: string
}

const UpcomingShifts: React.FC<UpcomingShiftsProps> = ({
  shifts,
  loading,
  failed,
  meId,
}) => {
  const now = new Date()
  if (failed) return <FullPageError />
  if (loading) return <FullContentLoader />
  if (shifts.length === 0) {
    return <MessageBox type="info">Du har ingen kommende vakter.</MessageBox>
  }

  const [next, ...rest] = shifts
  return (
    <Stack gap="md">
      <NextShiftCard shift={next} meId={meId} now={now} />
      {rest.length > 0 && (
        <MyShiftList groups={groupByWeek(rest, now)} meId={meId} />
      )}
    </Stack>
  )
}

interface PastShiftsProps {
  shifts: DayShift[] | undefined
  loading: boolean
  failed: boolean
  meId: string
}

const PastShifts: React.FC<PastShiftsProps> = ({
  shifts,
  loading,
  failed,
  meId,
}) => {
  if (failed) return <FullPageError />
  if (loading || !shifts) return <FullContentLoader />

  const past = pastShifts(shifts, new Date())
  if (past.length === 0) {
    return <MessageBox type="info">Du har ingen tidligere vakter.</MessageBox>
  }
  return <MyShiftList groups={groupByMonth(past)} meId={meId} />
}

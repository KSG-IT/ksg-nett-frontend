import { useQuery } from '@apollo/client'
import { Group, SegmentedControl, Stack, Text } from '@mantine/core'
import { useLocalStorage, useMediaQuery } from '@mantine/hooks'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { MessageBox } from 'components/MessageBox'
import { format } from 'date-fns'
import { useSearchParams } from 'react-router-dom'
import { useMe } from 'util/hooks'
import {
  DayShift,
  filterShifts,
  isMine,
  parseDayPart,
  ShiftFilter,
  slotCounts,
} from '../allShifts'
import {
  DayNavigation,
  ShiftFilters,
  ShiftList,
  ShiftTimeline,
} from '../components/AllShifts'
import { PlanningAvailabilityBanner } from '../components/PlanningAvailabilityBanner'
import { ALL_SHIFTS } from '../queries'
import { AllShiftsReturns, AllShiftsVariables } from '../types.graphql'

const breadcrumbsItems = [
  { label: 'Hjem', path: '/dashboard' },
  { label: 'Vakter', path: '/schedules/all-shifts' },
]

type View = 'timeline' | 'list'

const viewOptions = [
  { label: 'Tidslinje', value: 'timeline' },
  { label: 'Liste', value: 'list' },
]

// Sets or removes one search param and keeps the others.
function withParam(params: URLSearchParams, key: string, value: string | null) {
  const next = new URLSearchParams(params)
  if (value === null) next.delete(key)
  else next.set(key, value)
  return next
}

// Who works on a day. On a wide screen the timeline is the default, with a
// switch to the list; on a narrow screen only the list fits. The filters are
// in the URL. The chosen schedule is also saved, so your gjeng stays chosen.
export const AllShifts = () => {
  const me = useMe()
  const [searchParams, setSearchParams] = useSearchParams()
  const date = searchParams.get('date') ?? format(new Date(), 'yyyy-MM-dd')
  const wide = useMediaQuery('(min-width: 62em)')
  const [preferredView, setPreferredView] = useLocalStorage<View>({
    key: 'all-shifts-view',
    defaultValue: 'timeline',
  })
  const [savedScheduleId, setSavedScheduleId] = useLocalStorage<string | null>({
    key: 'all-shifts-schedule',
    defaultValue: null,
  })
  const filter: ShiftFilter = {
    scheduleId: searchParams.get('schedule') ?? savedScheduleId,
    part: parseDayPart(searchParams.get('part')),
    withMe: searchParams.get('withMe') === '1',
  }

  const { data, previousData, error, loading } = useQuery<
    AllShiftsReturns,
    AllShiftsVariables
  >(ALL_SHIFTS, {
    variables: { date },
    pollInterval: 30_000,
  })

  // Keep the last day on screen while the next one loads.
  const shifts = (data ?? previousData)?.allShifts

  function handleDateChange(newDate: string) {
    setSearchParams(withParam(searchParams, 'date', newDate))
  }

  function handleFilterChange(next: ShiftFilter) {
    setSavedScheduleId(next.scheduleId)
    let params = withParam(searchParams, 'schedule', next.scheduleId)
    params = withParam(params, 'part', next.part)
    params = withParam(params, 'withMe', next.withMe ? '1' : null)
    setSearchParams(params)
  }

  function handleViewChange(value: string) {
    setPreferredView(value as View)
  }

  if (error) return <FullPageError />
  if (!shifts && loading) return <FullContentLoader />

  const dayShifts = shifts ?? []
  const filtered = filterShifts(dayShifts, filter, me?.id)

  return (
    <Stack gap="md">
      <Breadcrumbs items={breadcrumbsItems} />
      <PlanningAvailabilityBanner />
      <DayNavigation date={date} onChange={handleDateChange} />
      <ShiftFilters
        filter={filter}
        canFilterWithMe={dayShifts.some(shift => isMine(shift, me?.id))}
        onChange={handleFilterChange}
      />
      <Group justify="space-between" wrap="wrap" gap="xs">
        <DaySummary shifts={filtered} />
        {wide && (
          <SegmentedControl
            size="xs"
            value={preferredView}
            onChange={handleViewChange}
            data={viewOptions}
          />
        )}
      </Group>
      <DayShifts
        key={date}
        shifts={dayShifts}
        filtered={filtered}
        view={wide ? preferredView : 'list'}
        meId={me?.id}
      />
    </Stack>
  )
}

interface DaySummaryProps {
  shifts: DayShift[]
}

const DaySummary: React.FC<DaySummaryProps> = ({ shifts }) => {
  const counts = shifts.map(slotCounts)
  const total = counts.reduce((sum, count) => sum + count.total, 0)
  const filled = counts.reduce((sum, count) => sum + count.filled, 0)
  const open = total - filled

  return (
    <Text size="sm" c="dimmed">
      {shifts.length} vakter · {filled} av {total} plasser fylt
      {open > 0 && (
        <Text span c="orange.7" fw={700}>
          {' '}
          · {open} ledige
        </Text>
      )}
    </Text>
  )
}

interface DayShiftsProps {
  shifts: DayShift[]
  // The shifts that the filters keep.
  filtered: DayShift[]
  view: View
  meId?: string
}

const DayShifts: React.FC<DayShiftsProps> = ({
  shifts,
  filtered,
  view,
  meId,
}) => {
  if (shifts.length === 0) {
    return <MessageBox type="info">Ingen vakter denne dagen.</MessageBox>
  }
  if (filtered.length === 0) {
    return <MessageBox type="info">Ingen vakter passer filtrene.</MessageBox>
  }
  if (view === 'timeline') {
    return <ShiftTimeline shifts={filtered} meId={meId} />
  }
  return <ShiftList shifts={filtered} meId={meId} />
}

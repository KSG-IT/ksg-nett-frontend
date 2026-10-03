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
import { DayShift, slotCounts } from '../allShifts'
import {
  DayNavigation,
  ShiftList,
  ShiftTimeline,
} from '../components/AllShifts'
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

// Who works on a day. On a wide screen the timeline is the default, with a
// switch to the list; on a narrow screen only the list fits.
export const AllShifts = () => {
  const me = useMe()
  const [searchParams, setSearchParams] = useSearchParams()
  const date = searchParams.get('date') ?? format(new Date(), 'yyyy-MM-dd')
  const wide = useMediaQuery('(min-width: 62em)')
  const [preferredView, setPreferredView] = useLocalStorage<View>({
    key: 'all-shifts-view',
    defaultValue: 'timeline',
  })

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
    setSearchParams({ date: newDate })
  }

  function handleViewChange(value: string) {
    setPreferredView(value as View)
  }

  if (error) return <FullPageError />
  if (!shifts && loading) return <FullContentLoader />

  return (
    <Stack gap="md">
      <Breadcrumbs items={breadcrumbsItems} />
      <DayNavigation date={date} onChange={handleDateChange} />
      <Group justify="space-between" wrap="wrap" gap="xs">
        <DaySummary shifts={shifts ?? []} />
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
        shifts={shifts ?? []}
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
  view: View
  meId?: string
}

const DayShifts: React.FC<DayShiftsProps> = ({ shifts, view, meId }) => {
  if (shifts.length === 0) {
    return <MessageBox type="info">Ingen vakter denne dagen.</MessageBox>
  }
  if (view === 'timeline') {
    return <ShiftTimeline shifts={shifts} meId={meId} />
  }
  return <ShiftList shifts={shifts} meId={meId} />
}

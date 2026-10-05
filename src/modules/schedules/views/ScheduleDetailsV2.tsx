import { useQuery } from '@apollo/client'
import {
  ActionIcon,
  Button,
  Drawer,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import {
  IconChevronLeft,
  IconChevronRight,
  IconUsers,
} from '@tabler/icons-react'
import { Breadcrumbs } from 'components/Breadcrumbs'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { addDays, format as formatBase, getISOWeek, parseISO } from 'date-fns'
import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useIsMobile } from 'util/hooks'
import { slotCounts } from '../allShifts'
import { CreateShiftSheet } from '../components/ScheduleV2/CreateShiftPopover'
import { ScheduleTabs } from '../components/ScheduleTabs'
import { LoadPanel } from '../components/ScheduleV2/LoadPanel'
import { ScheduleDayList } from '../components/ScheduleV2/ScheduleDayList'
import { SHEET_PROPS } from '../components/ScheduleV2/sheetProps'
import { ScheduleGrid } from '../components/ScheduleV2/ScheduleGrid'
import { ShiftPanel } from '../components/ScheduleV2/ShiftPanel'
import {
  SlotPickerSheet,
  SlotTarget,
} from '../components/ScheduleV2/SlotPicker'
import { LocationValues, ScheduleDisplayModeValues } from '../consts'
import { SCHEDULE_V2_QUERY } from '../queries'
import {
  mondayOf,
  nextOpenSlot,
  phoneDays,
  scheduleGrid,
  shiftCounts,
} from '../scheduleGrid'
import { rolesInUse } from '../shiftForm'
import { ScheduleV2Returns, ScheduleV2Variables } from '../types.graphql'
import classes from './ScheduleDetailsV2.module.css'

const WEEK_OPTIONS = ['1', '2', '3']

// The schedule managers' view, v2 (/schedules/:id/v2). The week and the
// number of weeks are in the URL, so a link opens the same period.
export const ScheduleDetailsV2: React.FC = () => {
  const { id } = useParams() as { id: string }
  const [searchParams, setSearchParams] = useSearchParams()
  const [active, setActive] = useState<SlotTarget | null>(null)
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(
    null
  )
  const [openShiftId, setOpenShiftId] = useState<string | null>(null)
  // Phone only: the create sheet and the shift count sheet
  const isMobile = useIsMobile()
  const [createTarget, setCreateTarget] = useState<{
    date: Date
    location: LocationValues | null
  } | null>(null)
  const [countsOpen, setCountsOpen] = useState(false)

  const from = searchParams.get('from')
  const monday = mondayOf(from ? parseISO(from) : new Date())
  const weeksParam = searchParams.get('weeks')

  const { data, previousData, loading, error } = useQuery<
    ScheduleV2Returns,
    ScheduleV2Variables
  >(SCHEDULE_V2_QUERY, {
    variables: {
      id,
      shiftsFrom: formatBase(monday, 'yyyy-MM-dd'),
      // Ask for 3 until the mode is known; the grid shows what is chosen.
      numberOfWeeks: Number(weeksParam ?? 3),
    },
  })

  const schedule = (data ?? previousData)?.schedule
  if (error) return <FullPageError />
  if (!schedule) return loading ? <FullContentLoader /> : <FullPageError />

  const byLocation =
    schedule.displayMode === ScheduleDisplayModeValues.MULTIPLE_LOCATIONS
  // Edgar fills 2–3 weeks at a time; several locations are planned per week.
  // A phone is for quick fixes, so it starts with one week.
  const weeks = Number(weeksParam ?? (byLocation || isMobile ? 1 : 3))
  const lastMonday = addDays(monday, (weeks - 1) * 7)
  const shifts = schedule.shiftsFromRange.filter(
    shift => new Date(shift.datetimeStart) < addDays(lastMonday, 7)
  )
  const grid = scheduleGrid(shifts, {
    monday,
    weeks,
    mode: schedule.displayMode,
    locations: schedule.recentLocations,
  })
  const counts = shifts.map(slotCounts)
  const total = counts.reduce((sum, count) => sum + count.total, 0)
  const filled = counts.reduce((sum, count) => sum + count.filled, 0)
  const period =
    weeks === 1
      ? `uke ${getISOWeek(monday)}`
      : `uke ${getISOWeek(monday)}–${getISOWeek(lastMonday)}`

  function setPeriod(newMonday: Date, newWeeks: number) {
    setActive(null)
    setSearchParams({
      from: formatBase(newMonday, 'yyyy-MM-dd'),
      weeks: String(newWeeks),
    })
  }

  function handlePrevious() {
    setPeriod(addDays(monday, -7), weeks)
  }

  function handleNext() {
    setPeriod(addDays(monday, 7), weeks)
  }

  function handleToday() {
    setPeriod(mondayOf(new Date()), weeks)
  }

  function handleWeeksChange(value: string) {
    setPeriod(monday, Number(value))
  }

  // After a pick, go on to the next open slot in the period.
  function handleAssigned(target: SlotTarget) {
    setActive(nextOpenSlot(shifts, target.slot.id))
  }

  function handleCreate(date: Date, location: LocationValues | null) {
    setCreateTarget({ date, location })
  }

  const createContext = {
    scheduleId: schedule.id,
    shifts: schedule.shiftsFromRange,
  }
  const selection = {
    shifts,
    active,
    highlightedUserId,
    onOpen: setActive,
    onClose: () => setActive(null),
    onAssigned: handleAssigned,
    create: createContext,
    defaultLocation: schedule.recentLocations[0] ?? null,
    onOpenShift: setOpenShiftId,
  }
  const loadPanel = (
    <LoadPanel
      counts={shiftCounts(shifts)}
      period={period}
      highlightedUserId={highlightedUserId}
      onHighlight={setHighlightedUserId}
    />
  )

  return (
    <Stack gap="md">
      <Breadcrumbs
        items={[
          { label: 'Hjem', path: '/dashboard' },
          { label: 'Vaktplaner', path: '/schedules' },
          { label: schedule.name, path: '' },
        ]}
      />
      <Group justify="space-between" wrap="wrap" gap="sm">
        <Title>{schedule.name}</Title>
        <Group gap="xs" wrap="wrap">
          <SegmentedControl
            size="xs"
            value={String(weeks)}
            onChange={handleWeeksChange}
            data={WEEK_OPTIONS.map(value => ({
              value,
              label: value === '1' ? '1 uke' : `${value} uker`,
            }))}
          />
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Forrige uke"
            onClick={handlePrevious}
          >
            <IconChevronLeft size={16} />
          </ActionIcon>
          <Button variant="default" onClick={handleToday}>
            Denne uka
          </Button>
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Neste uke"
            onClick={handleNext}
          >
            <IconChevronRight size={16} />
          </ActionIcon>
          <Button component={Link} to={`/schedules/${id}`} variant="subtle">
            Gammel visning
          </Button>
        </Group>
      </Group>
      <ScheduleTabs scheduleId={schedule.id} canManage={schedule.canManage} />
      <Group justify="space-between" gap="xs" wrap="nowrap">
        <Text size="sm" c="dimmed">
          {period.charAt(0).toUpperCase() + period.slice(1)} · {shifts.length}{' '}
          vakter · {filled} av {total} plasser fylt
          {total > filled && (
            <Text span inherit fw={700} c="orange.8">
              {' '}
              · {total - filled} ledige
            </Text>
          )}
        </Text>
        {isMobile && (
          <Button
            size="compact-sm"
            variant="default"
            leftSection={<IconUsers size={14} />}
            onClick={() => setCountsOpen(true)}
            style={{ flexShrink: 0 }}
            aria-label="Vakter per person"
          >
            Per person
          </Button>
        )}
      </Group>
      {isMobile ? (
        <>
          <ScheduleDayList
            days={phoneDays(grid)}
            onCreate={handleCreate}
            pickerAsSheet
            {...selection}
          />
          <SlotPickerSheet
            target={active}
            shifts={shifts}
            onClose={() => setActive(null)}
            onAssigned={handleAssigned}
          />
          <CreateShiftSheet
            target={createTarget}
            onClose={() => setCreateTarget(null)}
            {...createContext}
          />
          <Drawer
            opened={countsOpen}
            onClose={() => setCountsOpen(false)}
            {...SHEET_PROPS}
          >
            {loadPanel}
          </Drawer>
        </>
      ) : (
        <div className={classes.layout}>
          <ScheduleGrid weeks={grid} byLocation={byLocation} {...selection} />
          {loadPanel}
        </div>
      )}
      <ShiftPanel
        shift={shifts.find(shift => shift.id === openShiftId) ?? null}
        defaultRole={schedule.defaultRole}
        rolesInUse={rolesInUse(schedule.shiftsFromRange)}
        fullScreen={isMobile}
        onClose={() => setOpenShiftId(null)}
      />
    </Stack>
  )
}

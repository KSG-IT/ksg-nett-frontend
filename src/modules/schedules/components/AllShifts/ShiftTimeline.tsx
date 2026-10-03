import { Badge, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { CSSProperties, useState } from 'react'
import { format } from 'util/date-fns'
import {
  DayShift,
  isMine,
  Lane,
  laneLayout,
  slotCounts,
  timelineHours,
  TimelineRange,
  timelinePosition,
  timelineRange,
} from '../../allShifts'
import { parseLocation } from '../../util'
import { ShiftAvatars } from './ShiftAvatars'
import { ShiftDetails } from './ShiftDetails'
import { locationStyle, shiftLocation, shiftTime } from './shiftDisplay'
import classes from './ShiftTimeline.module.css'

interface ShiftTimelineProps {
  shifts: DayShift[]
  meId?: string
}

// One lane per location over the hours of the day. A click on a bar shows
// who works below the timeline. Your own shift is selected from the start.
export const ShiftTimeline: React.FC<ShiftTimelineProps> = ({
  shifts,
  meId,
}) => {
  const range = timelineRange(shifts)
  const [selectedId, setSelectedId] = useState<string | null>(
    () => shifts.find(shift => isMine(shift, meId))?.id ?? null
  )
  if (!range) return null

  const selected = shifts.find(shift => shift.id === selectedId)
  const toggle = (id: string) => setSelectedId(id === selectedId ? null : id)

  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <div className={classes.timeline}>
          <span />
          <TimelineTicks range={range} />
          <TimelineLanes
            lanes={laneLayout(shifts)}
            range={range}
            meId={meId}
            selectedId={selectedId}
            onSelect={toggle}
          />
        </div>
      </Paper>
      {selected && <SelectedShift shift={selected} />}
    </Stack>
  )
}

interface TimelineTicksProps {
  range: TimelineRange
}

// Hour labels over the tracks: every hour, or every second hour on a long day.
const TimelineTicks: React.FC<TimelineTicksProps> = ({ range }) => {
  const hours = timelineHours(range)
  const step = hours.length > 13 ? 2 : 1
  const position = (index: number) => (index / (hours.length - 1)) * 100
  const ticks = hours
    .map((hour, index) => ({ hour, left: position(index) }))
    .filter((_, index) => index % step === 0)

  return (
    <div className={classes.ticks}>
      {ticks.map(({ hour, left }) => (
        <span
          key={hour.getTime()}
          className={classes.tick}
          style={{ left: `${left}%` }}
        >
          {format(hour, 'HH')}
        </span>
      ))}
    </div>
  )
}

interface SelectionProps {
  range: TimelineRange
  meId?: string
  selectedId: string | null
  onSelect: (shiftId: string) => void
}

interface TimelineLanesProps extends SelectionProps {
  lanes: Lane<DayShift>[]
}

const TimelineLanes: React.FC<TimelineLanesProps> = ({ lanes, ...props }) => (
  <>
    {lanes.map(lane => (
      <TimelineLane key={lane.location ?? 'none'} lane={lane} {...props} />
    ))}
  </>
)

interface TimelineLaneProps extends SelectionProps {
  lane: Lane<DayShift>
}

// One location. Overlapping shifts get a row each; the name is on the first.
const TimelineLane: React.FC<TimelineLaneProps> = ({ lane, ...props }) => (
  <>
    {lane.rows.map((row, index) => (
      <TimelineRow
        key={row[0].id}
        location={index === 0 ? lane.location : undefined}
        shifts={row}
        {...props}
      />
    ))}
  </>
)

interface TimelineRowProps extends SelectionProps {
  // Set on the first row of a lane only. null is "no location".
  location?: DayShift['location']
  shifts: DayShift[]
}

const TimelineRow: React.FC<TimelineRowProps> = ({
  location,
  shifts,
  range,
  ...props
}) => {
  const hourCount = timelineHours(range).length - 1
  const trackStyle = { '--hours': hourCount } as CSSProperties

  return (
    <>
      <span className={classes.lane}>
        {location !== undefined && <LaneName location={location} />}
      </span>
      <div className={classes.track} style={trackStyle}>
        <TimelineBars shifts={shifts} range={range} {...props} />
      </div>
    </>
  )
}

interface LaneNameProps {
  location: DayShift['location']
}

const LaneName: React.FC<LaneNameProps> = ({ location }) => {
  const { name, color } = parseLocation(location)
  return (
    <>
      <span
        className={classes.dot}
        style={{ background: `var(--mantine-color-${color}-6)` }}
      />
      <Text span inherit truncate>
        {name || 'Uten lokale'}
      </Text>
    </>
  )
}

interface TimelineBarsProps extends SelectionProps {
  shifts: DayShift[]
}

const TimelineBars: React.FC<TimelineBarsProps> = ({ shifts, ...props }) => (
  <>
    {shifts.map(shift => (
      <TimelineBar key={shift.id} shift={shift} {...props} />
    ))}
  </>
)

interface TimelineBarProps extends SelectionProps {
  shift: DayShift
}

const TimelineBar: React.FC<TimelineBarProps> = ({
  shift,
  range,
  meId,
  selectedId,
  onSelect,
}) => {
  const { left, width } = timelinePosition(shift, range)
  const { open } = slotCounts(shift)
  const selected = shift.id === selectedId

  return (
    <button
      type="button"
      className={classes.bar}
      data-mine={isMine(shift, meId) || undefined}
      data-selected={selected || undefined}
      aria-pressed={selected}
      title={`${shift.name} ${shiftTime(shift)}`}
      style={{
        left: `${left}%`,
        width: `${width}%`,
        ...locationStyle(shiftLocation(shift).color),
      }}
      onClick={() => onSelect(shift.id)}
    >
      <span className={classes.label}>
        {shift.name} {shiftTime(shift)}
        {open > 0 && <span className={classes.open}> · {open} ledig</span>}
      </span>
      <ShiftAvatars
        shift={shift}
        meId={meId}
        max={3}
        size={22}
        linked={false}
      />
    </button>
  )
}

interface SelectedShiftProps {
  shift: DayShift
}

const SelectedShift: React.FC<SelectedShiftProps> = ({ shift }) => {
  const location = shiftLocation(shift)
  const counts = slotCounts(shift)

  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" mb="sm" wrap="wrap">
        <Group gap="xs">
          <Title order={4}>{shift.name}</Title>
          <Badge
            size="sm"
            variant="light"
            style={locationStyle(location.color)}
          >
            {location.name}
          </Badge>
        </Group>
        <Text size="sm" fw={600} style={{ fontVariantNumeric: 'tabular-nums' }}>
          {shiftTime(shift)} · {counts.filled}/{counts.total} fylt
        </Text>
      </Group>
      <ShiftDetails shift={shift} />
    </Paper>
  )
}

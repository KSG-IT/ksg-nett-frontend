import { Text, Tooltip } from '@mantine/core'
import { format } from 'util/date-fns'
import { DayShift, DayShiftSlot, slotCounts } from '../../allShifts'
import { compactTime, GridDay, GridRow, GridWeek } from '../../scheduleGrid'
import { locationColors, parseLocation, parseShiftRole } from '../../util'
import classes from './ScheduleGrid.module.css'
import { LocationValues } from '../../consts'
import { CreateContext, CreateShiftPopover } from './CreateShiftPopover'
import { SlotPicker, SlotTarget } from './SlotPicker'

const DAY_NAMES = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']

export interface SlotSelection {
  // All shifts in the visible weeks, for counts and "busy that day".
  shifts: DayShift[]
  active: SlotTarget | null
  highlightedUserId: string | null
  onOpen: (target: SlotTarget) => void
  onClose: () => void
  onAssigned: (target: SlotTarget) => void
  // Create a shift from a cell, and open a shift in the panel
  create: CreateContext
  // The location of a new shift when the rows are weeks
  defaultLocation: LocationValues | null
  onOpenShift: (shiftId: string) => void
}

interface ScheduleGridProps extends SlotSelection {
  weeks: GridWeek[]
  // One location: weeks are the rows. Several: locations are the rows.
  byLocation: boolean
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  weeks,
  byLocation,
  ...selection
}) => (
  <div className={classes.scroll}>
    {byLocation ? (
      <LocationWeeks weeks={weeks} {...selection} />
    ) : (
      <div className={classes.grid}>
        <DayHeader />
        <WeekRows weeks={weeks} {...selection} />
      </div>
    )}
  </div>
)

const DayHeader: React.FC = () => (
  <>
    <span className={classes.corner} />
    {DAY_NAMES.map(name => (
      <span key={name} className={classes.dayName}>
        {name}
      </span>
    ))}
  </>
)

interface WeeksProps extends SlotSelection {
  weeks: GridWeek[]
}

const WeekRows: React.FC<WeeksProps> = ({ weeks, ...selection }) => (
  <>
    {weeks.map(week => (
      <GridRowView
        key={week.label}
        row={week.rows[0]}
        label={<WeekLabel week={week} />}
        showDate
        {...selection}
      />
    ))}
  </>
)

interface WeekLabelProps {
  week: GridWeek
}

const WeekLabel: React.FC<WeekLabelProps> = ({ week }) => {
  const days = week.rows[0].days
  return (
    <>
      <span>{week.label}</span>
      <span className={classes.dim}>
        {format(days[0].date, 'd.')}–{format(days[6].date, 'd. MMM')}
      </span>
    </>
  )
}

const LocationWeeks: React.FC<WeeksProps> = ({ weeks, ...selection }) => (
  <>
    {weeks.map(week => (
      <LocationWeek key={week.label} week={week} {...selection} />
    ))}
  </>
)

interface LocationWeekProps extends SlotSelection {
  week: GridWeek
}

const LocationWeek: React.FC<LocationWeekProps> = ({ week, ...selection }) => (
  <div className={`${classes.grid} ${classes.byLocation}`}>
    <span className={classes.corner}>{week.label}</span>
    {week.rows[0]?.days.map((day, index) => (
      <span key={index} className={classes.dayName}>
        {DAY_NAMES[index]} {format(day.date, 'd.')}
      </span>
    ))}
    <LocationRows rows={week.rows} {...selection} />
  </div>
)

interface LocationRowsProps extends SlotSelection {
  rows: GridRow[]
}

const LocationRows: React.FC<LocationRowsProps> = ({ rows, ...selection }) => (
  <>
    {rows.map(row => (
      <GridRowView
        key={row.key}
        row={row}
        label={<LocationLabel location={row.location ?? null} />}
        {...selection}
      />
    ))}
  </>
)

interface LocationLabelProps {
  location: GridRow['location']
}

const LocationLabel: React.FC<LocationLabelProps> = ({ location }) => (
  <span className={classes.locationLabel}>
    <span
      className={classes.dot}
      style={{ background: locationColors(location ?? null).dot }}
    />
    {parseLocation(location ?? null).name || 'Uten lokale'}
  </span>
)

interface GridRowViewProps extends SlotSelection {
  row: GridRow
  label: React.ReactNode
  showDate?: boolean
}

const GridRowView: React.FC<GridRowViewProps> = ({
  row,
  label,
  showDate = false,
  ...selection
}) => (
  <>
    <div className={classes.rowLabel}>{label}</div>
    {row.days.map(day => (
      <DayCell
        key={day.date.getTime()}
        day={day}
        showDate={showDate}
        location={
          row.location !== undefined ? row.location : selection.defaultLocation
        }
        {...selection}
      />
    ))}
  </>
)

interface DayCellProps extends SlotSelection {
  day: GridDay
  showDate: boolean
  location: LocationValues | null
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  showDate,
  location,
  ...selection
}) => (
  <div
    className={classes.cell}
    data-empty={day.shifts.length === 0 || undefined}
  >
    {showDate && <span className={classes.date}>{format(day.date, 'd.')}</span>}
    {day.shifts.map(shift => (
      <ShiftBlock key={shift.id} shift={shift} {...selection} />
    ))}
    <CreateShiftPopover
      {...selection.create}
      date={day.date}
      location={location}
    />
  </div>
)

interface ShiftBlockProps extends SlotSelection {
  shift: DayShift
}

const ShiftBlock: React.FC<ShiftBlockProps> = ({ shift, ...selection }) => {
  const colors = locationColors(shift.location)
  const { open } = slotCounts(shift)
  return (
    <div
      className={classes.shift}
      data-open={open > 0 || undefined}
      style={{ background: colors.background, color: colors.text }}
    >
      <button
        type="button"
        className={classes.shiftTop}
        aria-label={`Åpne ${shift.name} ${compactTime(shift)}`}
        onClick={() => selection.onOpenShift(shift.id)}
      >
        <Text span inherit truncate fw={700}>
          {shift.name}
        </Text>
        <span className={classes.time}>{compactTime(shift)}</span>
      </button>
      <div className={classes.chips}>
        {shift.slots.map(slot => (
          <SlotChip key={slot.id} shift={shift} slot={slot} {...selection} />
        ))}
      </div>
    </div>
  )
}

interface SlotChipProps extends SlotSelection {
  shift: DayShift
  slot: DayShiftSlot
}

const SlotChip: React.FC<SlotChipProps> = ({ shift, slot, ...selection }) => {
  const { active, highlightedUserId, onOpen } = selection
  const isActive = active?.slot.id === slot.id
  const role = parseShiftRole(slot.role)
  const label = slot.user
    ? `${slot.user.getFullWithNickName}, ${role}`
    : `Ledig: ${role}`

  function handleOpen() {
    onOpen({ shift, slot })
  }

  const chip = (
    <button
      type="button"
      className={classes.chip}
      data-open={!slot.user || undefined}
      data-active={isActive || undefined}
      data-highlighted={
        (slot.user && slot.user.id === highlightedUserId) || undefined
      }
      aria-label={label}
      onClick={handleOpen}
    >
      {slot.user ? slot.user.initials : '+'}
    </button>
  )

  if (isActive) {
    return (
      <SlotPicker
        target={{ shift, slot }}
        shifts={selection.shifts}
        onClose={selection.onClose}
        onAssigned={selection.onAssigned}
      >
        {chip}
      </SlotPicker>
    )
  }
  return (
    <Tooltip label={label} openDelay={300} withinPortal>
      {chip}
    </Tooltip>
  )
}

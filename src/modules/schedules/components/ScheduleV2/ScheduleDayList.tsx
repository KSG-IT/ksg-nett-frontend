import { Button, Text } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { format } from 'util/date-fns'
import { DayShift, slotCounts } from '../../allShifts'
import { LocationValues } from '../../consts'
import { compactTime, PhoneDay, PhoneDayGroup } from '../../scheduleGrid'
import { locationColors, parseLocation } from '../../util'
import classes from './ScheduleDayList.module.css'
import { SlotChip, SlotSelection } from './ScheduleGrid'

// "Fredag 9. okt.": a capital first letter, not on the month
function dayTitle(date: Date) {
  const title = format(date, 'EEEE d. MMM')
  return title.charAt(0).toUpperCase() + title.slice(1)
}

interface ScheduleDayListProps extends SlotSelection {
  days: PhoneDay[]
  onCreate: (date: Date, location: LocationValues | null) => void
}

// The schedule on a phone: one card per day, the shifts below each other.
// The picker and the create form open as sheets (see ScheduleDetailsV2).
export const ScheduleDayList: React.FC<ScheduleDayListProps> = ({
  days,
  ...props
}) => (
  <div className={classes.list}>
    {days.map(day => (
      <DayCard key={day.date.getTime()} day={day} {...props} />
    ))}
  </div>
)

interface DayCardProps extends Omit<ScheduleDayListProps, 'days'> {
  day: PhoneDay
}

const DayCard: React.FC<DayCardProps> = ({ day, onCreate, ...selection }) => {
  const empty = day.groups.length === 0
  const location =
    day.groups[0]?.shifts[0]?.location ?? selection.defaultLocation

  function handleCreate() {
    onCreate(day.date, location)
  }

  return (
    <section className={classes.day} data-empty={empty || undefined}>
      <header className={classes.dayHeader}>
        <Text size="sm" fw={700}>
          {dayTitle(day.date)}
        </Text>
        {empty && (
          <Text size="xs" c="dimmed">
            Ingen vakter
          </Text>
        )}
        <Button
          size="compact-xs"
          variant="subtle"
          color="gray"
          leftSection={<IconPlus size={12} />}
          onClick={handleCreate}
          className={classes.add}
        >
          Ny vakt
        </Button>
      </header>
      <DayGroups groups={day.groups} {...selection} />
    </section>
  )
}

interface DayGroupsProps extends SlotSelection {
  groups: PhoneDayGroup[]
}

const DayGroups: React.FC<DayGroupsProps> = ({ groups, ...selection }) => (
  <>
    {groups.map(group => (
      <DayGroup key={group.key} group={group} {...selection} />
    ))}
  </>
)

interface DayGroupProps extends SlotSelection {
  group: PhoneDayGroup
}

const DayGroup: React.FC<DayGroupProps> = ({ group, ...selection }) => (
  <div className={classes.group}>
    {group.location !== undefined && (
      <span className={classes.location}>
        <span
          className={classes.dot}
          style={{ background: locationColors(group.location).dot }}
        />
        {parseLocation(group.location).name || 'Uten lokale'}
      </span>
    )}
    {group.shifts.map(shift => (
      <PhoneShift key={shift.id} shift={shift} {...selection} />
    ))}
  </div>
)

interface PhoneShiftProps extends SlotSelection {
  shift: DayShift
}

const PhoneShift: React.FC<PhoneShiftProps> = ({ shift, ...selection }) => {
  const colors = locationColors(shift.location)
  const { filled, total, open } = slotCounts(shift)
  return (
    <div
      className={classes.shift}
      data-open={open > 0 || undefined}
      style={{ background: colors.background, color: colors.text }}
    >
      <button
        type="button"
        className={classes.shiftTop}
        onClick={() => selection.onOpenShift(shift.id)}
      >
        <Text span inherit fw={700} truncate>
          {shift.name}
        </Text>
        <span className={classes.meta}>
          {compactTime(shift)} · {filled}/{total}
        </span>
      </button>
      <div className={classes.chips}>
        {shift.slots.map(slot => (
          <SlotChip key={slot.id} shift={shift} slot={slot} {...selection} />
        ))}
      </div>
    </div>
  )
}

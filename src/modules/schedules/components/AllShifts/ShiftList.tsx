import { Collapse, Paper, Text } from '@mantine/core'
import { Badge } from 'components/Badge'
import {
  DayPart,
  DayShift,
  groupByDayPart,
  isMine,
  slotCounts,
} from '../../allShifts'
import { ShiftAvatars } from './ShiftAvatars'
import { ShiftDetails } from './ShiftDetails'
import { locationColors } from '../../util'
import { LocationBadge } from '../LocationBadge'
import { useExpandableRow } from '../useExpandableRow'
import { shiftTime } from './shiftDisplay'
import classes from './ShiftList.module.css'

interface ShiftListProps {
  shifts: DayShift[]
  meId?: string
}

// One row per shift, grouped into Dag, Kveld and Natt. A click on a row
// shows who works and which slots are open.
export const ShiftList: React.FC<ShiftListProps> = ({ shifts, meId }) => (
  <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
    {groupByDayPart(shifts).map(group => (
      <ShiftGroup
        key={group.part}
        part={group.part}
        shifts={group.shifts}
        meId={meId}
      />
    ))}
  </Paper>
)

interface ShiftGroupProps {
  part: DayPart
  shifts: DayShift[]
  meId?: string
}

const ShiftGroup: React.FC<ShiftGroupProps> = ({ part, shifts, meId }) => (
  <>
    <div className={classes.group}>{part}</div>
    <ShiftRows shifts={shifts} meId={meId} />
  </>
)

interface ShiftRowsProps {
  shifts: DayShift[]
  meId?: string
}

const ShiftRows: React.FC<ShiftRowsProps> = ({ shifts, meId }) => (
  <>
    {shifts.map(shift => (
      <ShiftRow key={shift.id} shift={shift} meId={meId} />
    ))}
  </>
)

interface ShiftRowProps {
  shift: DayShift
  meId?: string
}

const ShiftRow: React.FC<ShiftRowProps> = ({ shift, meId }) => {
  const { expanded, rowProps } = useExpandableRow()
  const mine = isMine(shift, meId)
  const counts = slotCounts(shift)

  return (
    <>
      <div className={classes.row} data-mine={mine || undefined} {...rowProps}>
        <span className={classes.time}>
          {shiftTime(shift)}
          <LocationBadge
            location={shift.location}
            hiddenFrom="sm"
            size="xs"
            ml={6}
          />
        </span>
        <span className={classes.name}>
          <span
            className={classes.dot}
            style={{ background: locationColors(shift.location).dot }}
          />
          <Text fw={600} size="sm" truncate>
            {shift.name}
          </Text>
          {mine && (
            <Badge size="sm" variant="filled" color="samfundet-red">
              Din vakt
            </Badge>
          )}
          <LocationBadge location={shift.location} visibleFrom="sm" />
        </span>
        <span
          className={classes.avatars}
          onClick={event => event.stopPropagation()}
        >
          <ShiftAvatars shift={shift} meId={meId} />
        </span>
        <span
          className={classes.count}
          data-open={counts.open > 0 || undefined}
        >
          {counts.filled}/{counts.total}
        </span>
      </div>
      <Collapse expanded={expanded}>
        <div className={classes.details}>
          <ShiftDetails shift={shift} />
        </div>
      </Collapse>
    </>
  )
}

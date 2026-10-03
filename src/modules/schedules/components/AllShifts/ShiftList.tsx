import { Badge, Collapse, Paper, Text } from '@mantine/core'
import { useState } from 'react'
import {
  DayPart,
  DayShift,
  groupByDayPart,
  isMine,
  slotCounts,
} from '../../allShifts'
import { ShiftAvatars } from './ShiftAvatars'
import { ShiftDetails } from './ShiftDetails'
import { locationStyle, shiftLocation, shiftTime } from './shiftDisplay'
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
  const [expanded, setExpanded] = useState(false)
  const mine = isMine(shift, meId)
  const location = shiftLocation(shift)
  const counts = slotCounts(shift)
  const toggle = () => setExpanded(value => !value)

  return (
    <>
      <div
        className={classes.row}
        data-mine={mine || undefined}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={toggle}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            toggle()
          }
        }}
      >
        <span className={classes.time}>
          {shiftTime(shift)}
          {mine && <span className={classes.mineLabel}> · du er på</span>}
        </span>
        <span className={classes.name}>
          <span
            className={classes.dot}
            style={{ background: `var(--mantine-color-${location.color}-6)` }}
          />
          <Text fw={600} size="sm" truncate>
            {shift.name}
          </Text>
          <Badge
            visibleFrom="sm"
            size="sm"
            variant="light"
            style={locationStyle(location.color)}
          >
            {location.name}
          </Badge>
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

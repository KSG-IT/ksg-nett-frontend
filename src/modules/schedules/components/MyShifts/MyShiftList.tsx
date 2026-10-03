import { Collapse, Paper, Text } from '@mantine/core'
import { DayShift } from '../../allShifts'
import { coworkerShift, mySlot, ShiftGroup } from '../../myShifts'
import { parseShiftRole } from '../../util'
import { ShiftAvatars } from '../AllShifts/ShiftAvatars'
import { ShiftDetails } from '../AllShifts/ShiftDetails'
import { shiftTime } from '../AllShifts/shiftDisplay'
import { LocationBadge } from '../LocationBadge'
import { useExpandableRow } from '../useExpandableRow'
import { DateBlock } from './DateBlock'
import classes from './MyShiftList.module.css'

interface MyShiftListProps {
  groups: ShiftGroup[]
  meId: string
}

export const MyShiftList: React.FC<MyShiftListProps> = ({ groups, meId }) => (
  <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
    {groups.map(group => (
      <MyShiftGroup key={group.key} group={group} meId={meId} />
    ))}
  </Paper>
)

interface MyShiftGroupProps {
  group: ShiftGroup
  meId: string
}

const MyShiftGroup: React.FC<MyShiftGroupProps> = ({ group, meId }) => (
  <>
    <div className={classes.group}>{group.label}</div>
    <MyShiftRows shifts={group.shifts} meId={meId} />
  </>
)

interface MyShiftRowsProps {
  shifts: DayShift[]
  meId: string
}

const MyShiftRows: React.FC<MyShiftRowsProps> = ({ shifts, meId }) => (
  <>
    {shifts.map(shift => (
      <MyShiftRow key={shift.id} shift={shift} meId={meId} />
    ))}
  </>
)

interface MyShiftRowProps {
  shift: DayShift
  meId: string
}

const MyShiftRow: React.FC<MyShiftRowProps> = ({ shift, meId }) => {
  const { expanded, rowProps } = useExpandableRow()
  const slot = mySlot(shift, meId)

  return (
    <>
      <div className={classes.row} {...rowProps}>
        <DateBlock date={new Date(shift.datetimeStart)} size={44} />
        <div style={{ minWidth: 0 }}>
          <div className={classes.title}>
            <Text fw={600} size="sm" truncate>
              {shift.name}
            </Text>
            <LocationBadge location={shift.location} visibleFrom="sm" />
          </div>
          <div className={classes.meta}>
            {shiftTime(shift)}
            {slot && ` · ${parseShiftRole(slot.role)}`}
          </div>
        </div>
        <span onClick={event => event.stopPropagation()}>
          <ShiftAvatars shift={coworkerShift(shift, meId)} max={3} size={26} />
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

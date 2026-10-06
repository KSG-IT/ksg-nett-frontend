import { Group, Text } from '@mantine/core'
import { Badge } from 'components/Badge'
import { parseISO } from 'date-fns'
import { format } from 'util/date-fns'
import {
  countLabel,
  OpenUnfilledSlot,
  unfilledReasonLabel,
} from '../../autofill'
import { parseShiftRole } from '../../util'
import classes from './UnfilledSlotList.module.css'

interface UnfilledSlotListProps {
  rows: OpenUnfilledSlot[]
}

// The slots that autofill left empty and that are still empty, with the reason
// from the run. The rows wrap on a phone.
export const UnfilledSlotList: React.FC<UnfilledSlotListProps> = ({ rows }) => (
  <ul className={classes.list}>
    {rows.map(row => (
      <UnfilledSlotRow key={row.shiftSlot.id} row={row} />
    ))}
  </ul>
)

interface UnfilledSlotRowProps {
  row: OpenUnfilledSlot
}

const UnfilledSlotRow: React.FC<UnfilledSlotRowProps> = ({ row }) => {
  const { shift, role } = row.shiftSlot
  return (
    <li className={classes.row}>
      <Group justify="space-between" gap="xs" wrap="wrap">
        <div>
          <Text size="sm" fw={600}>
            {format(parseISO(shift.datetimeStart), 'EEE d. MMM, HH:mm')} ·{' '}
            {shift.name}
          </Text>
          <Text size="xs" c="dimmed">
            {parseShiftRole(role)} ·{' '}
            {countLabel(row.candidateCount, 'kandidat', 'kandidater')}
          </Text>
        </div>
        <Badge color="orange" variant="light" tt="none">
          {unfilledReasonLabel(row.reason)}
        </Badge>
      </Group>
    </li>
  )
}

import { ActionIcon, Avatar, Progress, Text } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { Badge } from 'components/Badge'
import { format } from 'util/date-fns'
import {
  availabilityLabel,
  averageFlag,
  capState,
  manualBadge,
  membershipTypeLabel,
  percentOf,
} from '../../roster'
import { ScheduleRosterNode } from '../../types.graphql'
import { parseShiftRole } from '../../util'
import classes from './Roster.module.css'

// The average of the available rows and the largest count, for all bars
export interface RosterScale {
  average: number | null
  max: number
}

interface RosterRowProps {
  row: ScheduleRosterNode
  scale: RosterScale
  onEdit: () => void
  onRemove: () => void
}

export const RosterRow: React.FC<RosterRowProps> = ({
  row,
  scale,
  onEdit,
  onRemove,
}) => {
  const badge = manualBadge(row)
  return (
    <div className={classes.row}>
      <div className={classes.name}>
        <Avatar src={row.user.profileImage} size="sm" radius="xl">
          {row.user.initials}
        </Avatar>
        <div className={classes.nameText}>
          <Text size="sm" fw={600} truncate>
            {row.user.fullName}
          </Text>
          {badge !== null && (
            <Badge size="xs" variant="light" color="gray">
              {badge}
            </Badge>
          )}
        </div>
      </div>
      <Text size="sm">{membershipTypeLabel(row.membershipType)}</Text>
      <Text size="sm">
        <span className={classes.label}>Rolle: </span>
        {parseShiftRole(row.autofillAs)}
      </Text>
      <Text size="sm">{availabilityLabel(row.defaultAvailability)}</Text>
      <ShiftCount row={row} scale={scale} />
      <CapCell row={row} />
      <Text size="sm">
        <span className={classes.label}>Siste: </span>
        {row.lastShift ? format(new Date(row.lastShift), 'd. MMM') : '–'}
      </Text>
      <div className={classes.actions}>
        <ActionIcon
          variant="subtle"
          aria-label={`Endre ${row.user.fullName}`}
          onClick={onEdit}
        >
          <IconPencil size={16} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="red"
          aria-label={`Fjern ${row.user.fullName}`}
          onClick={onRemove}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </div>
    </div>
  )
}

interface ShiftCountProps {
  row: ScheduleRosterNode
  scale: RosterScale
}

// Done and planned shifts as one bar, with a line at the average
const ShiftCount: React.FC<ShiftCountProps> = ({ row, scale }) => {
  const flag = averageFlag(row, scale.average)
  return (
    <div className={classes.count} data-flag={flag ?? undefined}>
      <Text size="sm" className={classes.countText}>
        {row.shiftsDone} · {row.shiftsPlanned} planlagt
      </Text>
      <div className={classes.bar}>
        <div
          className={classes.done}
          style={{ width: `${percentOf(row.shiftsDone, scale.max)}%` }}
        />
        <div
          className={classes.planned}
          style={{ width: `${percentOf(row.shiftsPlanned, scale.max)}%` }}
        />
        {scale.average !== null && (
          <div
            className={classes.marker}
            style={{ left: `${percentOf(scale.average, scale.max)}%` }}
            title="Snitt for tilgjengelige"
          />
        )}
      </div>
    </div>
  )
}

interface CapCellProps {
  row: ScheduleRosterNode
}

const CapCell: React.FC<CapCellProps> = ({ row }) => {
  const cap = capState(row)
  if (cap === null) {
    return (
      <Text size="sm" c="dimmed">
        <span className={classes.label}>Maks: </span>–
      </Text>
    )
  }
  return (
    <div>
      <Text
        size="sm"
        className={classes.cap}
        data-reached={cap.reached || undefined}
      >
        <span className={classes.label}>Maks: </span>
        {cap.label}
      </Text>
      <Progress
        value={cap.percent}
        size="xs"
        color={cap.reached ? 'red' : 'gray'}
      />
    </div>
  )
}

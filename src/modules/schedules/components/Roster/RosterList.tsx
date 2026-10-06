import { Paper, Text } from '@mantine/core'
import { ScheduleRosterNode } from '../../types.graphql'
import classes from './Roster.module.css'
import { RosterRow, RosterScale } from './RosterRow'

interface RosterListProps {
  rows: ScheduleRosterNode[]
  scale: RosterScale
  onEdit: (row: ScheduleRosterNode) => void
  onRemove: (row: ScheduleRosterNode) => void
  emptyMessage: string
}

// A table on a wide screen, a card per person on a phone
export const RosterList: React.FC<RosterListProps> = ({
  rows,
  scale,
  onEdit,
  onRemove,
  emptyMessage,
}) => {
  if (rows.length === 0) {
    return (
      <Paper withBorder radius="md" p="md">
        <Text size="sm" c="dimmed">
          {emptyMessage}
        </Text>
      </Paper>
    )
  }
  return (
    <Paper withBorder radius="md" className={classes.list}>
      <div className={`${classes.row} ${classes.header}`}>
        <span>Navn</span>
        <span>Type</span>
        <span>Rolle</span>
        <span>Standard</span>
        <span>Vakter · planlagt</span>
        <span>Maks</span>
        <span>Siste vakt</span>
        <span />
      </div>
      {rows.map(row => (
        <RosterRow
          key={row.id}
          row={row}
          scale={scale}
          onEdit={() => onEdit(row)}
          onRemove={() => onRemove(row)}
        />
      ))}
    </Paper>
  )
}

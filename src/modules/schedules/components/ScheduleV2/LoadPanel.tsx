import { Paper, Progress, Text, UnstyledButton } from '@mantine/core'
import { ShiftCount } from '../../scheduleGrid'
import classes from './ScheduleGrid.module.css'

interface LoadPanelProps {
  counts: ShiftCount[]
  period: string
  highlightedUserId: string | null
  onHighlight: (userId: string | null) => void
}

// Shifts per person in the visible weeks. A click on a name marks that
// person's slots in the grid.
export const LoadPanel: React.FC<LoadPanelProps> = ({
  counts,
  period,
  highlightedUserId,
  onHighlight,
}) => {
  const max = counts[0]?.count ?? 0
  return (
    <Paper withBorder radius="md" p="sm" className={classes.panel}>
      <Text size="sm" fw={700}>
        Vakter {period}
      </Text>
      <Text size="xs" c="dimmed" mb={6}>
        Klikk et navn for å markere vaktene i planen.
      </Text>
      {counts.length === 0 ? (
        <Text size="xs" c="dimmed">
          Ingen er satt opp ennå.
        </Text>
      ) : (
        <LoadRows
          counts={counts}
          max={max}
          highlightedUserId={highlightedUserId}
          onHighlight={onHighlight}
        />
      )}
    </Paper>
  )
}

interface LoadRowsProps extends Omit<LoadPanelProps, 'period'> {
  max: number
}

const LoadRows: React.FC<LoadRowsProps> = ({ counts, ...props }) => (
  <div className={classes.loadRows}>
    {counts.map(count => (
      <LoadRow key={count.user.id} count={count} {...props} />
    ))}
  </div>
)

interface LoadRowProps extends Omit<LoadRowsProps, 'counts'> {
  count: ShiftCount
}

const LoadRow: React.FC<LoadRowProps> = ({
  count,
  max,
  highlightedUserId,
  onHighlight,
}) => {
  const selected = count.user.id === highlightedUserId

  function handleClick() {
    onHighlight(selected ? null : count.user.id)
  }

  return (
    <UnstyledButton
      className={classes.loadRow}
      data-selected={selected || undefined}
      aria-pressed={selected}
      onClick={handleClick}
    >
      <Text size="xs" truncate>
        {count.user.getCleanFullName}
      </Text>
      <Progress
        value={(count.count / max) * 100}
        size="sm"
        color="samfundet-red"
      />
      <Text size="xs" fw={700} ta="right">
        {count.count}
      </Text>
    </UnstyledButton>
  )
}

import { Center, Group, Table, Text, UnstyledButton } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from '@tabler/icons-react'
import { SortDirection } from './tableSort'

// Based on TableSort from ui.mantine.dev (MIT)

interface SortableThProps {
  children: React.ReactNode
  sorted: boolean
  direction: SortDirection
  onSort: () => void
}

export const SortableTh: React.FC<SortableThProps> = ({
  children,
  sorted,
  direction,
  onSort,
}) => {
  const { classes } = useStyles()
  const Icon = sorted
    ? direction === 'asc'
      ? IconChevronUp
      : IconChevronDown
    : IconSelector

  return (
    <Table.Th
      p={0}
      aria-sort={
        sorted ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'
      }
    >
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between" wrap="nowrap" gap="xs">
          <Text fw={600} fz="sm">
            {children}
          </Text>
          <Center c={sorted ? undefined : 'dimmed'}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  )
}

const useStyles = createStyles({
  control: {
    width: '100%',
    padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-sm)',
    '&:hover': {
      backgroundColor: 'var(--mantine-color-default-hover)',
    },
  },
})

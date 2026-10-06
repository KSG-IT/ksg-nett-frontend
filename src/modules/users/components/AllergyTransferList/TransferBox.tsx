import {
  Checkbox,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { filterTransferItems, TransferItem } from '../../transferList'
import classes from './TransferList.module.css'

interface TransferBoxProps {
  title: string
  items: TransferItem[]
  markedIds: string[]
  onToggle: (id: string) => void
  emptyText: string
}

// One side of the transfer list: a title with a count, a search field and the
// items. A click on an item marks it. The arrow buttons move the marked items.
export const TransferBox: React.FC<TransferBoxProps> = ({
  title,
  items,
  markedIds,
  onToggle,
  emptyText,
}) => {
  const [query, setQuery] = useState('')
  const visible = filterTransferItems(items, query)
  const hasQuery = query.trim() !== ''

  return (
    <Stack gap={0} className={classes.box}>
      <Group justify="space-between" className={classes.header}>
        <Text fw={600} size="sm">
          {title}
        </Text>
        <Text c="dimmed" size="xs">
          {items.length}
        </Text>
      </Group>
      <TextInput
        variant="unstyled"
        className={classes.search}
        leftSection={<IconSearch size={14} />}
        placeholder="Søk"
        value={query}
        onChange={event => setQuery(event.currentTarget.value)}
        aria-label={`Søk i ${title}`}
      />
      <ScrollArea h={280} type="auto">
        {visible.length === 0 && (
          <Text c="dimmed" size="sm" ta="center" p="md">
            {hasQuery ? 'Ingen treff' : emptyText}
          </Text>
        )}
        <TransferRows
          items={visible}
          markedIds={markedIds}
          onToggle={onToggle}
        />
      </ScrollArea>
    </Stack>
  )
}

interface TransferRowsProps {
  items: TransferItem[]
  markedIds: string[]
  onToggle: (id: string) => void
}

const TransferRows: React.FC<TransferRowsProps> = ({
  items,
  markedIds,
  onToggle,
}) => (
  <>
    {items.map(item => {
      const marked = markedIds.includes(item.id)
      return (
        <UnstyledButton
          key={item.id}
          className={classes.row}
          data-marked={marked || undefined}
          aria-pressed={marked}
          onClick={() => onToggle(item.id)}
        >
          <Checkbox
            checked={marked}
            readOnly
            tabIndex={-1}
            size="xs"
            aria-hidden
          />
          <Text size="sm">{item.name}</Text>
        </UnstyledButton>
      )
    })}
  </>
)

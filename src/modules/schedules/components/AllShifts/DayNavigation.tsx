import { ActionIcon, Button, Group, Popover, Title } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import { addDays, format as formatBase, parseISO } from 'date-fns'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { capitalizeFirstLetter } from 'util/parsing'

interface DayNavigationProps {
  // YYYY-MM-DD
  date: string
  onChange: (date: string) => void
}

const toApiDate = (date: Date) => formatBase(date, 'yyyy-MM-dd')

// "Fredag 9. oktober" with ‹ I dag › and a date picker.
export const DayNavigation: React.FC<DayNavigationProps> = ({
  date,
  onChange,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false)
  const day = parseISO(date)
  const today = toApiDate(new Date())

  return (
    <Group justify="space-between" wrap="wrap" gap="sm">
      <Title order={1}>
        {capitalizeFirstLetter(format(day, 'cccc d. MMMM'))}
      </Title>
      <Group gap="xs" wrap="nowrap">
        <ActionIcon
          variant="default"
          size="lg"
          aria-label="Forrige dag"
          onClick={() => onChange(toApiDate(addDays(day, -1)))}
        >
          <IconChevronLeft size={18} />
        </ActionIcon>
        <Button
          variant="default"
          disabled={date === today}
          onClick={() => onChange(today)}
        >
          I dag
        </Button>
        <ActionIcon
          variant="default"
          size="lg"
          aria-label="Neste dag"
          onClick={() => onChange(toApiDate(addDays(day, 1)))}
        >
          <IconChevronRight size={18} />
        </ActionIcon>
        <Popover
          opened={pickerOpen}
          onChange={setPickerOpen}
          position="bottom-end"
        >
          <Popover.Target>
            <ActionIcon
              variant="default"
              size="lg"
              aria-label="Velg dato"
              onClick={() => setPickerOpen(open => !open)}
            >
              <IconCalendar size={18} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <DatePicker
              value={date}
              onChange={value => {
                if (value) onChange(value)
                setPickerOpen(false)
              }}
            />
          </Popover.Dropdown>
        </Popover>
      </Group>
    </Group>
  )
}

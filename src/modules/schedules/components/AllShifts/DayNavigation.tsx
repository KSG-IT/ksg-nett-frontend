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
  date: string
  onChange: (date: string) => void
}

const toApiDate = (date: Date) => formatBase(date, 'yyyy-MM-dd')

export const DayNavigation: React.FC<DayNavigationProps> = ({
  date,
  onChange,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false)
  const day = parseISO(date)
  const today = toApiDate(new Date())

  function handlePreviousDay() {
    onChange(toApiDate(addDays(day, -1)))
  }

  function handleNextDay() {
    onChange(toApiDate(addDays(day, 1)))
  }

  function handlePickDate(value: string | null) {
    if (value) onChange(value)
    setPickerOpen(false)
  }

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
          onClick={handlePreviousDay}
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
          onClick={handleNextDay}
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
            <DatePicker value={date} onChange={handlePickDate} />
          </Popover.Dropdown>
        </Popover>
      </Group>
    </Group>
  )
}

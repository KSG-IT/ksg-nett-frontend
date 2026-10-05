import { useQuery } from '@apollo/client'
import { Chip, Group, SegmentedControl, Select } from '@mantine/core'
import { parseDayPart, ShiftFilter } from '../../allShifts'
import { ALL_SCHEDULES } from '../../queries'
import { AllSchedulesReturns } from '../../types.graphql'

const ALL_PARTS = 'all'

const partOptions = [
  { label: 'Hele dagen', value: ALL_PARTS },
  { label: 'Dag', value: 'Dag' },
  { label: 'Kveld', value: 'Kveld' },
  { label: 'Natt', value: 'Natt' },
]

interface ShiftFiltersProps {
  filter: ShiftFilter
  // True when you have a shift on the day.
  canFilterWithMe: boolean
  onChange: (filter: ShiftFilter) => void
}

// Filters for the shifts page: one schedule (a gjeng), one part of the day,
// and the shifts at the same time as yours.
export const ShiftFilters: React.FC<ShiftFiltersProps> = ({
  filter,
  canFilterWithMe,
  onChange,
}) => {
  const { data } = useQuery<AllSchedulesReturns>(ALL_SCHEDULES)
  const scheduleOptions = (data?.allSchedules ?? []).map(schedule => ({
    value: schedule.id,
    label: schedule.name,
  }))

  return (
    <Group gap="xs" wrap="wrap">
      <Select
        size="xs"
        w={180}
        placeholder="Alle gjenger"
        aria-label="Gjeng"
        clearable
        data={scheduleOptions}
        value={filter.scheduleId}
        onChange={scheduleId => onChange({ ...filter, scheduleId })}
      />
      <SegmentedControl
        size="xs"
        data={partOptions}
        value={filter.part ?? ALL_PARTS}
        onChange={value => onChange({ ...filter, part: parseDayPart(value) })}
      />
      {canFilterWithMe && (
        <Chip
          size="xs"
          checked={filter.withMe}
          onChange={withMe => onChange({ ...filter, withMe })}
        >
          Jobber samtidig som meg
        </Chip>
      )}
    </Group>
  )
}

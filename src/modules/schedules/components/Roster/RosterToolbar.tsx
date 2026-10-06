import { Select, SimpleGrid, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { RoleValues } from '../../consts'
import {
  RosterFilter,
  RosterSort,
  membershipTypeOptions,
  roleOptions,
} from '../../roster'
import { ScheduleRosterNode } from '../../types.graphql'

const SORT_OPTIONS: { value: RosterSort; label: string }[] = [
  { value: 'fewest', label: 'Færrest vakter først' },
  { value: 'most', label: 'Flest vakter først' },
  { value: 'name', label: 'Navn' },
]

interface RosterToolbarProps {
  rows: ScheduleRosterNode[]
  filter: RosterFilter
  onChange: (filter: RosterFilter) => void
}

export const RosterToolbar: React.FC<RosterToolbarProps> = ({
  rows,
  filter,
  onChange,
}) => (
  <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="sm">
    <TextInput
      placeholder="Søk etter navn"
      aria-label="Søk etter navn"
      leftSection={<IconSearch size={16} />}
      value={filter.search}
      onChange={event =>
        onChange({ ...filter, search: event.currentTarget.value })
      }
    />
    <Select
      placeholder="Alle typer"
      aria-label="Type"
      data={membershipTypeOptions(rows)}
      clearable
      value={filter.membershipType}
      onChange={membershipType => onChange({ ...filter, membershipType })}
    />
    <Select
      placeholder="Alle roller"
      aria-label="Rolle"
      data={roleOptions(rows)}
      clearable
      value={filter.role}
      onChange={role =>
        onChange({ ...filter, role: role as RoleValues | null })
      }
    />
    <Select
      aria-label="Sortering"
      data={SORT_OPTIONS}
      allowDeselect={false}
      value={filter.sort}
      onChange={sort => onChange({ ...filter, sort: sort as RosterSort })}
    />
  </SimpleGrid>
)

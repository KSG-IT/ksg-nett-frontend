import {
  ActionIcon,
  Chip,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import {
  LocationValues,
  RoleValues,
  v2LocationOptions,
  v2RoleOptions,
} from '../../consts'
import {
  RoleCount,
  setRoleCount,
  ShiftFormValues,
  ShiftSuggestion,
} from '../../shiftForm'
import { parseShiftRole } from '../../util'
import classes from './ScheduleGrid.module.css'

type Change = (values: Partial<ShiftFormValues>) => void

interface ShiftDetailsFieldsProps {
  values: ShiftFormValues
  onChange: Change
  // Create: date from the cell, so it is not shown. Edit: the date can move.
  withDate?: boolean
}

export const ShiftDetailsFields: React.FC<ShiftDetailsFieldsProps> = ({
  values,
  onChange,
  withDate = false,
}) => (
  <Stack gap="xs">
    <TextInput
      size="xs"
      label="Navn"
      value={values.name}
      onChange={event => onChange({ name: event.currentTarget.value })}
      data-autofocus
      required
    />
    <Select
      size="xs"
      label="Lokale"
      data={v2LocationOptions}
      value={values.location}
      onChange={value => onChange({ location: value as LocationValues | null })}
      clearable
      comboboxProps={{ withinPortal: false }}
    />
    {withDate && (
      <TextInput
        size="xs"
        type="date"
        label="Dato"
        value={values.date}
        onChange={event => onChange({ date: event.currentTarget.value })}
        required
      />
    )}
    <Group grow gap="xs">
      <TextInput
        size="xs"
        type="time"
        label="Start"
        value={values.startTime}
        onChange={event => onChange({ startTime: event.currentTarget.value })}
        required
      />
      <TextInput
        size="xs"
        type="time"
        label="Slutt"
        value={values.endTime}
        onChange={event => onChange({ endTime: event.currentTarget.value })}
        required
      />
    </Group>
    {values.endTime <= values.startTime && (
      <Text size="xs" c="dimmed">
        Slutter dagen etter.
      </Text>
    )}
  </Stack>
)

interface NameSuggestionsProps {
  suggestions: ShiftSuggestion[]
  selected: string
  onPick: (suggestion: ShiftSuggestion) => void
}

// Names already used at the location. A pick fills in the usual times and
// slots.
export const NameSuggestions: React.FC<NameSuggestionsProps> = ({
  suggestions,
  selected,
  onPick,
}) =>
  suggestions.length === 0 ? null : (
    <Group gap={4}>
      {suggestions.slice(0, 5).map(suggestion => (
        <Chip
          key={suggestion.name}
          size="xs"
          checked={suggestion.name === selected}
          onChange={() => onPick(suggestion)}
        >
          {suggestion.name}
        </Chip>
      ))}
    </Group>
  )

interface RoleSteppersProps {
  slots: RoleCount[]
  onChange: (slots: RoleCount[]) => void
}

export const RoleSteppers: React.FC<RoleSteppersProps> = ({
  slots,
  onChange,
}) => {
  const unused = v2RoleOptions.filter(
    option => !slots.some(slot => slot.role === option.value)
  )

  function handleCount(role: RoleValues, count: number) {
    onChange(setRoleCount(slots, role, count))
  }

  function handleAddRole(role: string | null) {
    if (role) onChange([...slots, { role: role as RoleValues, count: 1 }])
  }

  return (
    <Stack gap={4}>
      <Text size="xs" fw={500}>
        Plasser
      </Text>
      {slots.map(slot => (
        <RoleStepper key={slot.role} slot={slot} onCount={handleCount} />
      ))}
      <Select
        size="xs"
        placeholder={slots.length ? '+ Legg til rolle' : 'Velg en rolle'}
        data={unused}
        value={null}
        onChange={handleAddRole}
        searchable
        comboboxProps={{ withinPortal: false }}
      />
    </Stack>
  )
}

interface RoleStepperProps {
  slot: RoleCount
  onCount: (role: RoleValues, count: number) => void
}

const RoleStepper: React.FC<RoleStepperProps> = ({ slot, onCount }) => (
  <div className={classes.stepper}>
    <Text size="sm">{parseShiftRole(slot.role)}</Text>
    <Group gap={6} wrap="nowrap">
      <ActionIcon
        size="sm"
        variant="default"
        aria-label={`Færre ${parseShiftRole(slot.role)}`}
        onClick={() => onCount(slot.role, slot.count - 1)}
      >
        <IconMinus size={12} />
      </ActionIcon>
      <Text size="sm" fw={700} w={16} ta="center">
        {slot.count}
      </Text>
      <ActionIcon
        size="sm"
        variant="default"
        aria-label={`Flere ${parseShiftRole(slot.role)}`}
        onClick={() => onCount(slot.role, slot.count + 1)}
      >
        <IconPlus size={12} />
      </ActionIcon>
    </Group>
  </div>
)

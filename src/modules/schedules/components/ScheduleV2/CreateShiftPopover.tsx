import { useMutation } from '@apollo/client'
import {
  Button,
  Drawer,
  Popover,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { DayShift } from '../../allShifts'
import { LocationValues } from '../../consts'
import { CREATE_SHIFT_WITH_SLOTS_MUTATION } from '../../mutations'
import {
  emptyShiftForm,
  nameSuggestions,
  rolesInUse,
  ShiftFormValues,
  ShiftSuggestion,
  toCreateInput,
} from '../../shiftForm'
import classes from './ScheduleGrid.module.css'
import { SHEET_PROPS } from './sheetProps'
import {
  NameSuggestions,
  RoleSteppers,
  ShiftDetailsFields,
} from './ShiftFormFields'

export interface CreateContext {
  scheduleId: string
  // All loaded shifts, for the name suggestions.
  shifts: DayShift[]
}

interface CreateShiftFormProps extends CreateContext {
  date: Date
  location: LocationValues | null
  onDone: () => void
}

// The form for one new shift. The date and location come from where the
// manager clicked.
const CreateShiftForm: React.FC<CreateShiftFormProps> = ({
  scheduleId,
  shifts,
  date,
  location,
  onDone,
}) => {
  const [values, setValues] = useState<ShiftFormValues>(() =>
    emptyShiftForm(date, location)
  )
  const [create, { loading }] = useMutation(CREATE_SHIFT_WITH_SLOTS_MUTATION, {
    refetchQueries: ['ScheduleV2'],
    awaitRefetchQueries: true,
  })
  const suggestions = nameSuggestions(shifts, values.location)
  const slotTotal = values.slots.reduce((sum, slot) => sum + slot.count, 0)

  function handleChange(change: Partial<ShiftFormValues>) {
    setValues(current => ({ ...current, ...change }))
  }

  function handlePick(suggestion: ShiftSuggestion) {
    setValues(current => ({ ...current, ...suggestion }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    create({
      variables: { input: toCreateInput(scheduleId, values) },
      onCompleted() {
        showNotification({ message: `${values.name.trim()} er opprettet` })
        onDone()
      },
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message, color: 'red' })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="xs">
        <Text size="sm" fw={700}>
          Ny vakt · {format(date, 'EEEE d. MMM')}
        </Text>
        <NameSuggestions
          suggestions={suggestions}
          selected={values.name}
          onPick={handlePick}
        />
        <ShiftDetailsFields values={values} onChange={handleChange} />
        <RoleSteppers
          slots={values.slots}
          rolesInUse={rolesInUse(shifts)}
          onChange={slots => handleChange({ slots })}
        />
        <Button
          type="submit"
          size="xs"
          color="samfundet-red"
          loading={loading}
          disabled={!values.name.trim() || slotTotal === 0}
        >
          Opprett vakt med {slotTotal} {slotTotal === 1 ? 'plass' : 'plasser'}
        </Button>
      </Stack>
    </form>
  )
}

interface CreateShiftPopoverProps extends CreateContext {
  date: Date
  location: LocationValues | null
}

// Desktop: the + in a day cell opens the form in a popover.
export const CreateShiftPopover: React.FC<CreateShiftPopoverProps> = props => {
  const [opened, setOpened] = useState(false)
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="right-start"
      width={300}
      shadow="md"
      trapFocus
      withinPortal
    >
      <Popover.Target>
        <UnstyledButton
          className={classes.addShift}
          aria-label={`Ny vakt ${format(props.date, 'EEEE d. MMMM')}`}
          onClick={() => setOpened(true)}
        >
          <IconPlus size={12} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p="sm">
        {opened && (
          <CreateShiftForm {...props} onDone={() => setOpened(false)} />
        )}
      </Popover.Dropdown>
    </Popover>
  )
}

interface CreateShiftSheetProps extends CreateContext {
  // null closes the sheet
  target: { date: Date; location: LocationValues | null } | null
  onClose: () => void
}

// Phone: the form in a sheet from the bottom of the screen.
export const CreateShiftSheet: React.FC<CreateShiftSheetProps> = ({
  target,
  onClose,
  ...context
}) => (
  <Drawer opened={target !== null} onClose={onClose} {...SHEET_PROPS}>
    {target && (
      <CreateShiftForm
        key={target.date.getTime()}
        {...context}
        date={target.date}
        location={target.location}
        onDone={onClose}
      />
    )}
  </Drawer>
)

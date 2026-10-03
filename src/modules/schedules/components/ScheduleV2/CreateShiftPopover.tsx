import { useMutation } from '@apollo/client'
import { Button, Popover, Stack, Text, UnstyledButton } from '@mantine/core'
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
  ShiftFormValues,
  ShiftSuggestion,
  toCreateInput,
} from '../../shiftForm'
import classes from './ScheduleGrid.module.css'
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

interface CreateShiftPopoverProps extends CreateContext {
  date: Date
  location: LocationValues | null
}

// The + in a day cell: a small form with the date and location from the cell.
export const CreateShiftPopover: React.FC<CreateShiftPopoverProps> = ({
  scheduleId,
  shifts,
  date,
  location,
}) => {
  const [opened, setOpened] = useState(false)
  const [values, setValues] = useState<ShiftFormValues>(() =>
    emptyShiftForm(date, location)
  )
  const [create, { loading }] = useMutation(CREATE_SHIFT_WITH_SLOTS_MUTATION, {
    refetchQueries: ['ScheduleV2'],
    awaitRefetchQueries: true,
  })
  const suggestions = nameSuggestions(shifts, values.location)
  const slotTotal = values.slots.reduce((sum, slot) => sum + slot.count, 0)

  function handleOpen() {
    setValues(emptyShiftForm(date, location))
    setOpened(true)
  }

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
        setOpened(false)
      },
      onError({ message }) {
        showNotification({ title: 'Noe gikk galt', message, color: 'red' })
      },
    })
  }

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
          aria-label={`Ny vakt ${format(date, 'EEEE d. MMMM')}`}
          onClick={handleOpen}
        >
          <IconPlus size={12} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p="sm">
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
              onChange={slots => handleChange({ slots })}
            />
            <Button
              type="submit"
              size="xs"
              color="samfundet-red"
              loading={loading}
              disabled={!values.name.trim() || slotTotal === 0}
            >
              Opprett vakt med {slotTotal}{' '}
              {slotTotal === 1 ? 'plass' : 'plasser'}
            </Button>
          </Stack>
        </form>
      </Popover.Dropdown>
    </Popover>
  )
}

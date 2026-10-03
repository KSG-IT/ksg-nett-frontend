import { useMutation } from '@apollo/client'
import {
  ActionIcon,
  Button,
  Drawer,
  Group,
  Select,
  Stack,
  Text,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconTrash, IconUserMinus } from '@tabler/icons-react'
import { useState } from 'react'
import { format } from 'util/date-fns'
import { DayShift, DayShiftSlot, slotCounts } from '../../allShifts'
import { RoleValues } from '../../consts'
import {
  ADD_SLOTS_TO_SHIFT_MUTATION,
  CLEAR_SLOT_V2_MUTATION,
  DELETE_SHIFT_MUTATION,
  DELETE_SHIFT_SLOT_MUTATION,
  UPDATE_SHIFT_DETAILS_MUTATION,
} from '../../mutations'
import { compactTime } from '../../scheduleGrid'
import {
  clockTime,
  roleCounts,
  roleOptionGroups,
  ShiftFormValues,
  toUpdateInput,
} from '../../shiftForm'
import { parseShiftRole } from '../../util'
import { LocationBadge } from '../LocationBadge'
import classes from './ScheduleGrid.module.css'
import { ShiftDetailsFields } from './ShiftFormFields'

const REFETCH = { refetchQueries: ['ScheduleV2'], awaitRefetchQueries: true }

function notifyError({ message }: { message: string }) {
  showNotification({ title: 'Noe gikk galt', message, color: 'red' })
}

interface ShiftPanelProps {
  // null closes the panel.
  shift: DayShift | null
  defaultRole: RoleValues | null
  // The roles of the schedule, suggested first in the "Ny plass" select.
  rolesInUse: RoleValues[]
  // Phone: the panel covers the screen
  fullScreen?: boolean
  onClose: () => void
}

// A click on a shift name opens this panel: the slots by role, add or delete
// slots, change the shift, delete it.
export const ShiftPanel: React.FC<ShiftPanelProps> = ({
  shift,
  defaultRole,
  rolesInUse,
  fullScreen = false,
  onClose,
}) => (
  <Drawer
    opened={shift !== null}
    onClose={onClose}
    position="right"
    size={fullScreen ? '100%' : 'md'}
    title={shift ? <PanelTitle shift={shift} /> : null}
  >
    {shift && (
      <PanelBody
        key={shift.id}
        shift={shift}
        defaultRole={defaultRole}
        rolesInUse={rolesInUse}
        onDeleted={onClose}
      />
    )}
  </Drawer>
)

interface PanelTitleProps {
  shift: DayShift
}

const PanelTitle: React.FC<PanelTitleProps> = ({ shift }) => {
  const { filled, total } = slotCounts(shift)
  return (
    <Stack gap={2}>
      <Text fw={700} size="lg">
        {shift.name}
      </Text>
      <Group gap="xs">
        <Text size="sm" c="dimmed">
          {format(new Date(shift.datetimeStart), 'EEEE d. MMM')} ·{' '}
          {compactTime(shift)} · {filled} av {total} fylt
        </Text>
        <LocationBadge location={shift.location} size="xs" />
      </Group>
    </Stack>
  )
}

interface PanelBodyProps {
  shift: DayShift
  defaultRole: RoleValues | null
  rolesInUse: RoleValues[]
  onDeleted: () => void
}

const PanelBody: React.FC<PanelBodyProps> = ({
  shift,
  defaultRole,
  rolesInUse,
  onDeleted,
}) => {
  const [editing, setEditing] = useState(false)
  const [newRole, setNewRole] = useState<RoleValues>(
    defaultRole ?? shift.slots[0]?.role ?? RoleValues.BARISTA
  )
  const [addSlots, { loading: adding }] = useMutation(
    ADD_SLOTS_TO_SHIFT_MUTATION,
    REFETCH
  )

  function handleAddSlot() {
    addSlots({
      variables: {
        shiftId: shift.id,
        slots: [{ shiftSlotRole: newRole, count: 1 }],
      },
      onError: notifyError,
    })
  }

  return (
    <Stack gap="md">
      {editing ? (
        <EditShiftForm shift={shift} onDone={() => setEditing(false)} />
      ) : (
        <Button
          variant="default"
          size="xs"
          onClick={() => setEditing(true)}
          style={{ alignSelf: 'flex-start' }}
        >
          Endre navn, lokale eller tid
        </Button>
      )}
      <SlotList slots={shift.slots} />
      <Group gap="xs" align="flex-end">
        <Select
          size="xs"
          label="Ny plass"
          data={roleOptionGroups(rolesInUse, [])}
          value={newRole}
          onChange={value => value && setNewRole(value as RoleValues)}
          style={{ flex: 1 }}
        />
        <Button
          size="xs"
          variant="light"
          loading={adding}
          onClick={handleAddSlot}
        >
          Legg til plass
        </Button>
      </Group>
      <DeleteShift shift={shift} onDeleted={onDeleted} />
    </Stack>
  )
}

interface SlotListProps {
  slots: DayShiftSlot[]
}

// Grouped by role, in the order of the first slot of each role.
const SlotList: React.FC<SlotListProps> = ({ slots }) => {
  const order = roleCounts(slots).map(count => count.role)
  const sorted = [...slots].sort(
    (a, b) => order.indexOf(a.role) - order.indexOf(b.role)
  )
  return (
    <div>
      {sorted.map(slot => (
        <SlotRow key={slot.id} slot={slot} />
      ))}
    </div>
  )
}

interface SlotRowProps {
  slot: DayShiftSlot
}

const SlotRow: React.FC<SlotRowProps> = ({ slot }) => {
  const [clear, { loading: clearing }] = useMutation(
    CLEAR_SLOT_V2_MUTATION,
    REFETCH
  )
  const [deleteSlot, { loading: deleting }] = useMutation(
    DELETE_SHIFT_SLOT_MUTATION,
    REFETCH
  )

  function handleClear() {
    clear({ variables: { shiftSlotId: slot.id }, onError: notifyError })
  }

  function handleDelete() {
    deleteSlot({ variables: { id: slot.id }, onError: notifyError })
  }

  return (
    <div className={classes.slotRow}>
      <Text size="xs" c="dimmed" fw={600}>
        {parseShiftRole(slot.role)}
      </Text>
      {slot.user ? (
        <Text size="sm" truncate>
          {slot.user.getFullWithNickName}
        </Text>
      ) : (
        <Text size="sm" c="orange.8">
          Ledig
        </Text>
      )}
      {slot.user ? (
        <ActionIcon
          variant="subtle"
          color="gray"
          loading={clearing}
          aria-label={`Fjern ${slot.user.getCleanFullName}`}
          onClick={handleClear}
        >
          <IconUserMinus size={16} />
        </ActionIcon>
      ) : (
        <ActionIcon
          variant="subtle"
          color="gray"
          loading={deleting}
          aria-label="Slett plassen"
          onClick={handleDelete}
        >
          <IconTrash size={16} />
        </ActionIcon>
      )}
    </div>
  )
}

interface EditShiftFormProps {
  shift: DayShift
  onDone: () => void
}

const EditShiftForm: React.FC<EditShiftFormProps> = ({ shift, onDone }) => {
  const [values, setValues] = useState<ShiftFormValues>({
    name: shift.name,
    location: shift.location,
    date: format(new Date(shift.datetimeStart), 'yyyy-MM-dd'),
    startTime: clockTime(shift.datetimeStart),
    endTime: clockTime(shift.datetimeEnd),
    slots: [],
  })
  const [update, { loading }] = useMutation(
    UPDATE_SHIFT_DETAILS_MUTATION,
    REFETCH
  )

  function handleChange(change: Partial<ShiftFormValues>) {
    setValues(current => ({ ...current, ...change }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    update({
      variables: { input: toUpdateInput(shift.id, values) },
      onCompleted: onDone,
      onError: notifyError,
    })
  }

  return (
    <form onSubmit={handleSubmit} className={classes.editForm}>
      <Stack gap="xs">
        <ShiftDetailsFields values={values} onChange={handleChange} withDate />
        <Group gap="xs" justify="flex-end">
          <Button size="xs" variant="subtle" color="gray" onClick={onDone}>
            Avbryt
          </Button>
          <Button
            type="submit"
            size="xs"
            color="samfundet-red"
            loading={loading}
            disabled={!values.name.trim()}
          >
            Lagre
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

interface DeleteShiftProps {
  shift: DayShift
  onDeleted: () => void
}

// Two steps, because the people on the shift lose it.
const DeleteShift: React.FC<DeleteShiftProps> = ({ shift, onDeleted }) => {
  const [confirming, setConfirming] = useState(false)
  const [deleteShift, { loading }] = useMutation(DELETE_SHIFT_MUTATION, REFETCH)
  const { filled } = slotCounts(shift)

  function handleDelete() {
    deleteShift({
      variables: { id: shift.id },
      onCompleted() {
        showNotification({ message: `${shift.name} er slettet` })
        onDeleted()
      },
      onError: notifyError,
    })
  }

  if (!confirming) {
    return (
      <Button
        variant="subtle"
        color="red"
        size="xs"
        leftSection={<IconTrash size={14} />}
        onClick={() => setConfirming(true)}
        style={{ alignSelf: 'flex-start' }}
      >
        Slett vakt
      </Button>
    )
  }
  return (
    <div className={classes.confirm}>
      <Text size="sm">
        Slette {shift.name}?
        {filled > 0 &&
          ` ${filled} ${
            filled === 1 ? 'person mister' : 'personer mister'
          } vakten.`}
      </Text>
      <Group gap="xs">
        <Button size="xs" color="red" loading={loading} onClick={handleDelete}>
          Slett
        </Button>
        <Button
          size="xs"
          variant="subtle"
          color="gray"
          onClick={() => setConfirming(false)}
        >
          Avbryt
        </Button>
      </Group>
    </div>
  )
}

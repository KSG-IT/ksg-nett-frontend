import { createStyles, Group, Text, UnstyledButton } from '@mantine/core'
import { IconTrash, IconX } from '@tabler/icons'
import {
  useShiftMutations,
  useShiftSlotMutations,
} from 'modules/schedules/mutations.hooks'
import {
  MY_UPCOMING_SHIFTS,
  NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
} from 'modules/schedules/queries'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { parseLocation } from 'modules/schedules/util'
import toast from 'react-hot-toast'
import { format } from 'util/date-fns'

interface ShiftCardProps {
  shift: ShiftNode
}
export const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  const { classes } = useShiftCardStyles()
  const {
    addUserToShiftSlot,
    addUserToShiftSlotLoading,
    removeUserFromShiftSlot,
    removeUserFromShiftSlotLoading,
  } = useShiftSlotMutations()

  const { deleteShift, deleteShiftLoading } = useShiftMutations()

  function handleDeleteWeekShifts() {
    // Should trigger a confirm delete dialog

    toast.error('Lol ikke implementert enda')
    console.error('Missing feature')
  }

  function handleDeleteShift() {
    // Should trigger a confirm delete dialog
    deleteShift({
      variables: { id: shift.id },
      refetchQueries: [MY_UPCOMING_SHIFTS, NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Vakt slettet')
      },
    })
  }

  function handleRemoveUserFromShiftSlot(shiftSlotId: string) {
    removeUserFromShiftSlot({
      variables: {
        shiftSlotId: shiftSlotId,
      },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY, MY_UPCOMING_SHIFTS],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Bruker fjernet fra vakt')
      },
    })
  }

  return (
    <div
      className={shift.isFilled ? classes.filledShift : classes.notFilledShift}
    >
      <Group position="apart" align={'flex-end'}>
        <Text>{shift.name}</Text>
        <UnstyledButton>
          <IconTrash size="18px" onClick={handleDeleteShift} />
        </UnstyledButton>
      </Group>
      <Text>{parseLocation(shift.location)}</Text>

      <Text>
        {format(new Date(shift.datetimeStart), 'MM.dd')}{' '}
        {format(new Date(shift.datetimeStart), 'HH:mm')}
      </Text>
      {shift.slots.map((slot, index) => (
        <div key={index}>
          <Text>{slot.role}</Text>
          {slot.user && (
            <Group>
              <Text>{slot.user.fullName}</Text>
              <UnstyledButton
                onClick={() => handleRemoveUserFromShiftSlot(slot.id)}
              >
                <IconX />
              </UnstyledButton>
            </Group>
          )}
        </div>
      ))}
    </div>
  )
}

const useShiftCardStyles = createStyles(theme => ({
  filledShift: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid green',
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.green[6],
    color: 'white',
  },
  notFilledShift: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid green',
    backgroundColor: theme.colors.red[6],
    marginBottom: theme.spacing.xs,
    color: 'white',
  },
}))

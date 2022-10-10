import { createStyles, Group, Text, UnstyledButton } from '@mantine/core'
import { IconTrash } from '@tabler/icons'
import { useShiftMutations } from 'modules/schedules/mutations.hooks'
import {
  MY_UPCOMING_SHIFTS,
  NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
} from 'modules/schedules/queries'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { parseLocation } from 'modules/schedules/util'
import toast from 'react-hot-toast'
import { format } from 'util/date-fns'
import { ShiftCardSlot } from './ShiftCardSlot'

interface ShiftCardProps {
  shift: ShiftNode
}
export const ShiftCard: React.FC<ShiftCardProps> = ({ shift }) => {
  const { classes } = useShiftCardStyles()

  const { deleteShift } = useShiftMutations()

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
      {shift.slots.map(slot => (
        <ShiftCardSlot key={slot.id} shiftSlot={slot} />
      ))}
    </div>
  )
}

const useShiftCardStyles = createStyles(theme => ({
  filledShift: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid green',
    fontSize: '14px',
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.green[6],
    color: 'white',
  },
  notFilledShift: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid green',
    fontSize: '14px',
    backgroundColor: theme.colors.red[6],
    marginBottom: theme.spacing.xs,
    color: 'white',
  },
}))

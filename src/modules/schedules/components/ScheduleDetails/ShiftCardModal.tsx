import { gql, useQuery } from '@apollo/client'
import {
  DrawerProps,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons'
import { FullPageError } from 'components/FullPageComponents'
import { FullContentLoader } from 'components/Loading'
import { useShiftMutations } from 'modules/schedules/mutations.hooks'
import { NORMALIZED_SHIFTS_FROM_RANGE_QUERY } from 'modules/schedules/queries'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { AddShiftSlotPopover } from './AddShiftSlotPopover'
import { ShiftSlot } from './ShiftSlot'

interface ShiftCardDrawerProps extends DrawerProps {
  shiftId: string | null
}

export const SHIFT_DETAIL_QUERY = gql`
  query ShiftDetail($id: ID!) {
    shift(id: $id) {
      id
      name
      location
      datetimeStart
      datetimeEnd
      slots {
        id
        role
        user {
          id
          getCleanFullName
          getFullWithNickName
          profileImage
          initials
        }
      }
    }
  }
`

export const ShiftCardModal: React.FC<ShiftCardDrawerProps> = ({
  shiftId,
  opened,
  onClose,
}) => {
  const { deleteShift } = useShiftMutations()

  const { data, loading, error } = useQuery<{ shift: ShiftNode }>(
    SHIFT_DETAIL_QUERY,
    {
      variables: {
        id: shiftId,
      },
      skip: !shiftId,
    }
  )

  if (!opened) return null

  if (error) return <FullPageError />

  if (!data || loading) {
    return (
      <Modal opened={true} onClose={() => {}}>
        <FullContentLoader />
      </Modal>
    )
  }

  const { shift } = data

  function handleClose() {
    onClose()
  }

  function handleDeleteShift() {
    if (!shift) return

    const userConfirmed = confirm(
      `Er du sikker på at du vil slette vakt ${shift.name}?`
    )

    if (!userConfirmed) return

    deleteShift({
      variables: { id: shift.id },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
      onCompleted() {
        showNotification({
          title: 'Vakt slettet',
          message: 'Vakt ble slettet',
          color: 'green',
        })
        onClose()
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
          color: 'red',
        })
      },
    })
  }

  return (
    <Modal
      title={
        <Group position="apart" align="flex-start">
          <Stack spacing={0} my={0}>
            <Title order={3} my={0}>
              {shift?.name}
            </Title>
            <Text size="sm" color="gray">
              {shift?.location}
            </Text>
          </Stack>

          <UnstyledButton onClick={handleDeleteShift}>
            <IconTrash color="darkred" />
          </UnstyledButton>
        </Group>
      }
      size={'md'}
      opened={opened}
      onClose={handleClose}
    >
      <Stack spacing={'xs'}>
        {shift.slots.map(slot => (
          <ShiftSlot shiftSlot={slot} />
        ))}

        <AddShiftSlotPopover shift={shift as ShiftNode} />
      </Stack>
    </Modal>
  )
}

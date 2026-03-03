import {
  Button,
  createStyles,
  Group,
  Popover,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconX } from '@tabler/icons-react'
import { UserSelect } from 'components/Select'
import { useShiftSlotMutations } from 'modules/schedules/mutations.hooks'
import {
  MY_UPCOMING_SHIFTS,
  NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
} from 'modules/schedules/queries'
import { ShiftSlotNode } from 'modules/schedules/types.graphql'
import { useMemo, useState } from 'react'

interface ShiftCardSlotProps {
  shiftSlot: ShiftSlotNode
}

export const ShiftCardSlot: React.FC<ShiftCardSlotProps> = ({ shiftSlot }) => {
  const { classes } = useShiftCardSlotStyles()
  const [opened, setOpened] = useState(false)

  const { addUserToShiftSlot, removeUserFromShiftSlot, deleteShiftSlot } =
    useShiftSlotMutations()

  function handleRemoveUserFromShiftSlot(shiftSlotId: string) {
    removeUserFromShiftSlot({
      variables: {
        shiftSlotId: shiftSlotId,
      },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY, MY_UPCOMING_SHIFTS],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Bruker fjernet fra vakt',
          color: 'green',
        })
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

  function handleAddUserToShift(val: string) {
    addUserToShiftSlot({
      variables: {
        shiftSlotId: shiftSlot.id,
        userId: val,
      },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY, MY_UPCOMING_SHIFTS],
      onCompleted() {
        setOpened(false)
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

  function handleDeleteShiftSlot() {
    deleteShiftSlot({
      variables: {
        id: shiftSlot.id,
      },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Vakt fjernet',
          color: 'green',
        })
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

  const renderedText = useMemo(
    () =>
      shiftSlot.user === null ? (
        <Text className={classes.hoverableRed} onClick={() => setOpened(true)}>
          {shiftSlot.role}
        </Text>
      ) : (
        <Group justify="space-between">
          <Text
            className={classes.hoverableGreen}
            onClick={() => setOpened(true)}
          >
            {shiftSlot.user.getFullWithNickName}
          </Text>
          <UnstyledButton
            onClick={() => handleRemoveUserFromShiftSlot(shiftSlot.id)}
          >
            <IconX size="16px" color="white" />
          </UnstyledButton>
        </Group>
      ),

    [shiftSlot]
  )

  return (
    <Popover opened={opened} onChange={setOpened} withinPortal>
      <Popover.Target>
        <Text c={'white'}>{renderedText}</Text>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs" className={classes.wrapper}>
          <Group justify="space-between" align="flex-end">
            <Text tt="uppercase" c={'dimmed'}>
              Velg bruker for skift
            </Text>
            <Button color="samfundet-red" onClick={handleDeleteShiftSlot}>
              Slett
            </Button>
          </Group>
          <UserSelect width="90%" setUserCallback={handleAddUserToShift} />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

const useShiftCardSlotStyles = createStyles({
  hoverableGreen: {
    color: 'var(--mantine-color-green-7)',
    ':hover': {
      cursor: 'pointer',
      backgroundColor: 'var(--mantine-color-green-1)',
      borderRadius: 'var(--mantine-radius-sm)',
    },
  },
  hoverableRed: {
    color: 'var(--mantine-color-gray-4)',
    fontWeight: 800,
    ':hover': {
      cursor: 'pointer',
      backgroundColor: 'var(--mantine-color-gray-0)',
      borderRadius: 'var(--mantine-radius-sm)',
    },
  },
  wrapper: {
    color: 'black',
  },
})

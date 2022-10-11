import {
  Button,
  createStyles,
  Group,
  Popover,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { IconX } from '@tabler/icons'
import { UserSelect } from 'components/Select'
import { useShiftSlotMutations } from 'modules/schedules/mutations.hooks'
import {
  MY_UPCOMING_SHIFTS,
  NORMALIZED_SHIFTS_FROM_RANGE_QUERY,
} from 'modules/schedules/queries'
import { ShiftSlotNode } from 'modules/schedules/types.graphql'
import { useState } from 'react'
import toast from 'react-hot-toast'

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
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Bruker fjernet fra vakt')
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
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        setOpened(false)
      },
    })
  }

  function handleDeleteShiftSlot() {
    deleteShiftSlot({
      variables: {
        id: shiftSlot.id,
      },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Vakt fjernet')
      },
    })
  }

  const renderedText =
    shiftSlot.user === null ? (
      <Text className={classes.hoverable} onClick={() => setOpened(true)}>
        {shiftSlot.role}
      </Text>
    ) : (
      <Group position="apart">
        <Text className={classes.hoverable} onClick={() => setOpened(true)}>
          {shiftSlot.user.fullName}
        </Text>
        <UnstyledButton
          onClick={() => handleRemoveUserFromShiftSlot(shiftSlot.id)}
        >
          <IconX size="16px" />
        </UnstyledButton>
      </Group>
    )

  return (
    <Popover opened={opened} onChange={setOpened}>
      <Popover.Target>
        <div>{renderedText}</div>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack spacing="xs" className={classes.wrapper}>
          <Group position="apart" align="flex-end">
            <label>Velg bruker for skift</label>
            <Button color="red" onClick={handleDeleteShiftSlot}>
              Slett
            </Button>
          </Group>
          <UserSelect setUserCallback={handleAddUserToShift} />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

const useShiftCardSlotStyles = createStyles(theme => ({
  hoverable: {
    ':hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.gray[6],
    },
  },
  wrapper: {
    color: 'black',
  },
}))

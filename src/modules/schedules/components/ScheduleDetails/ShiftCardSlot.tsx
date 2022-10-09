import {
  createStyles,
  Group,
  Popover,
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

  const {
    addUserToShiftSlot,

    removeUserFromShiftSlot,
  } = useShiftSlotMutations()

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
    console.log(val)
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

  return (
    <Popover opened={opened} onChange={setOpened}>
      <Popover.Target>
        <div>
          <Text className={classes.wrapper} onClick={() => setOpened(true)}>
            {shiftSlot.role}
          </Text>
          {shiftSlot.user && (
            <Group>
              <Text className={classes.wrapper} onClick={() => setOpened(true)}>
                {shiftSlot.user.fullName}
              </Text>
              <UnstyledButton
                onClick={() => handleRemoveUserFromShiftSlot(shiftSlot.id)}
              >
                <IconX />
              </UnstyledButton>
            </Group>
          )}
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <UserSelect setUserCallback={handleAddUserToShift} />
      </Popover.Dropdown>
    </Popover>
  )
}

const useShiftCardSlotStyles = createStyles(theme => ({
  wrapper: {
    ':hover': {
      cursor: 'pointer',
      backgroundColor: theme.colors.gray[6],
    },
  },
}))

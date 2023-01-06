import { Button, Popover, Stack } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { RoleValues } from 'modules/schedules/consts'
import { useShiftSlotMutations } from 'modules/schedules/mutations.hooks'
import { NORMALIZED_SHIFTS_FROM_RANGE_QUERY } from 'modules/schedules/queries'
import { ShiftNode } from 'modules/schedules/types.graphql'
import React, { useState } from 'react'
import { ShiftRoleSelect } from '../ScheduleRoleSelect'
import { SHIFT_DETAIL_QUERY } from './ShiftCardModal'

interface AddShiftSlotPopoverProps {
  shift: ShiftNode
}

export const AddShiftSlotPopover: React.FC<AddShiftSlotPopoverProps> = ({
  shift,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState<RoleValues>(RoleValues.ARRANGEMENTANSVARLIG)

  const { createShiftSlot } = useShiftSlotMutations()

  function handleAddShiftSlot() {
    createShiftSlot({
      variables: {
        input: {
          shift: shift.id,
          role,
        },
      },
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY, SHIFT_DETAIL_QUERY],
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
      onCompleted() {
        setIsOpen(false)
      },
    })
  }

  function togglePopover() {
    setIsOpen(prev => !prev)
  }
  return (
    <Popover
      withinPortal
      opened={isOpen}
      onClose={() => setIsOpen(false)}
      position="right-start"
    >
      <Popover.Target>
        <Button
          size="md"
          variant="outline"
          compact
          color={'gray'}
          onClick={togglePopover}
          mt="sm"
        >
          Legg til skift
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack>
          <ShiftRoleSelect
            value={role}
            label="Velg rolle"
            onChangeCallback={setRole}
          />
          <Button onClick={handleAddShiftSlot}>Legg til</Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

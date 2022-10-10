import { Button, Popover, Stack } from '@mantine/core'
import { RoleValues } from 'modules/schedules/consts'
import { useShiftSlotMutations } from 'modules/schedules/mutations.hooks'
import { NORMALIZED_SHIFTS_FROM_RANGE_QUERY } from 'modules/schedules/queries'
import { ShiftNode } from 'modules/schedules/types.graphql'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ShiftRoleSelect } from '../ScheduleRoleSelect'

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
      refetchQueries: [NORMALIZED_SHIFTS_FROM_RANGE_QUERY],
      onError() {
        toast.error('Noe gikk galt')
      },
      onCompleted() {
        toast.success('Vakt lagt til')
        setIsOpen(false)
      },
    })
  }
  return (
    <Popover opened={isOpen} onClose={() => setIsOpen(false)}>
      <Popover.Target>
        <Button onClick={() => setIsOpen(true)} mt="sm">
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

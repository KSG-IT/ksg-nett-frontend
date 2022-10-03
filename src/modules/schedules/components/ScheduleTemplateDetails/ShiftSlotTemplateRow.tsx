import { Button, NumberInput, Text } from '@mantine/core'
import { useShiftSlotTemplateMutations } from 'modules/schedules/mutations.hooks'
import { SCHEDULE_TEMPLATE_QUERY } from 'modules/schedules/queries'
import { ShiftSlotTemplateNode } from 'modules/schedules/types.graphql'
import { parseShiftRole } from 'modules/schedules/util'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ShiftSlotTemplateRowProps {
  shiftSlotTemplate: ShiftSlotTemplateNode
}

export const ShiftSlotTemplateRow: React.FC<ShiftSlotTemplateRowProps> = ({
  shiftSlotTemplate,
}) => {
  const [count, setCount] = useState(shiftSlotTemplate.count)
  const {
    deleteShiftSlotTemplate,
    deleteShiftSlotTemplateLoading,
    patchShiftSlotTemplate,
  } = useShiftSlotTemplateMutations()

  function handleDeleteShiftSlotTemplate(shiftSlotTemplateId: string) {
    deleteShiftSlotTemplate({
      variables: {
        id: shiftSlotTemplateId,
      },
      refetchQueries: [SCHEDULE_TEMPLATE_QUERY],
      onError: error => {
        toast.error(error.message)
      },
      onCompleted: () => {
        toast.success('Vaktrolle slettet')
      },
    })
  }

  function handleSaveCount() {
    if (count === shiftSlotTemplate.count) return
    patchShiftSlotTemplate({
      variables: {
        id: shiftSlotTemplate.id,
        input: {
          count: count,
        },
      },
      refetchQueries: [SCHEDULE_TEMPLATE_QUERY],
      onError: error => {
        toast.error(error.message)
      },
      onCompleted: () => {
        toast.success('Vakt oppdatert')
      },
    })
  }

  return (
    <tr>
      <td>
        <Text>{parseShiftRole(shiftSlotTemplate.role)}</Text>
      </td>
      <td>
        <NumberInput value={count} onChange={evt => evt && setCount(evt)} />
      </td>
      <td>
        <Button variant="subtle" onClick={handleSaveCount}>
          Lagre
        </Button>
      </td>
      <td>
        <Button
          variant="subtle"
          color="red"
          loading={deleteShiftSlotTemplateLoading}
          onClick={() => handleDeleteShiftSlotTemplate(shiftSlotTemplate.id)}
        >
          Slett rolle
        </Button>
      </td>
    </tr>
  )
}

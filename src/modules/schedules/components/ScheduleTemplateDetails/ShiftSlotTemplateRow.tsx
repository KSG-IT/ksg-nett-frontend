import { Button, NumberInput, Table, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useShiftSlotTemplateMutations } from 'modules/schedules/mutations.hooks'
import { SCHEDULE_TEMPLATE_QUERY } from 'modules/schedules/queries'
import { ShiftSlotTemplateNode } from 'modules/schedules/types.graphql'
import { parseShiftRole } from 'modules/schedules/util'
import { useState } from 'react'

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
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Rollen ble slettet',
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
      onCompleted() {
        showNotification({
          title: 'Suksess',
          message: 'Antall vakter oppdatert',
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

  return (
    <Table.Tr>
      <Table.Td>
        <Text>{parseShiftRole(shiftSlotTemplate.role)}</Text>
      </Table.Td>
      <Table.Td>
        <NumberInput
          value={count}
          onChange={evt => typeof evt === 'number' && setCount(evt)}
        />
      </Table.Td>
      <Table.Td>
        <Button variant="subtle" onClick={handleSaveCount}>
          Lagre
        </Button>
      </Table.Td>
      <Table.Td>
        <Button
          variant="subtle"
          color="red"
          loading={deleteShiftSlotTemplateLoading}
          onClick={() => handleDeleteShiftSlotTemplate(shiftSlotTemplate.id)}
        >
          Slett rolle
        </Button>
      </Table.Td>
    </Table.Tr>
  )
}

import { Accordion, Button, Group, Table, Text } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons'
import { RoleValues } from 'modules/schedules/consts'
import {
  useShiftSlotTemplateMutations,
  useShiftTemplateMutations,
} from 'modules/schedules/mutations.hooks'
import { SCHEDULE_TEMPLATE_QUERY } from 'modules/schedules/queries'
import { ShiftTemplateNode } from 'modules/schedules/types.graphql'
import { parseDay, parseLocation } from 'modules/schedules/util'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ShiftRoleSelect } from '../ScheduleRoleSelect'
import { ShiftSlotTemplateRow } from './ShiftSlotTemplateRow'

interface ShiftTemplateAccordionItemProps {
  shiftTemplate: ShiftTemplateNode
}
export const ShiftTemplateAccordionItem: React.FC<
  ShiftTemplateAccordionItemProps
> = ({ shiftTemplate }) => {
  const [role, setRole] = useState(RoleValues.ARRANGEMENTANSVARLIG)

  const { deleteShiftTemplate, deleteShiftTemplateLoading } =
    useShiftTemplateMutations()
  const { createShiftSlotTemplate, createShiftSlotTemplateLoading } =
    useShiftSlotTemplateMutations()

  function handleDeleteShiftTemplate() {
    deleteShiftTemplate({
      variables: {
        id: shiftTemplate.id,
      },
      refetchQueries: [SCHEDULE_TEMPLATE_QUERY],
      onError: error => {
        toast.error(error.message)
      },
      onCompleted: () => {
        toast.success('Vakt slettet')
      },
    })
  }

  function handleCreateShiftSlotTemplate() {
    createShiftSlotTemplate({
      variables: {
        input: {
          shiftTemplate: shiftTemplate.id,
          role: role,
          count: 1,
        },
      },
      refetchQueries: [SCHEDULE_TEMPLATE_QUERY],
      onError: error => {
        toast.error(error.message)
      },
      onCompleted: () => {
        toast.success('Vakt opprettet')
      },
    })
  }

  return (
    <Accordion.Item value={shiftTemplate.id}>
      <Accordion.Control>
        <Group position="apart">
          {parseDay(shiftTemplate.day)}
          <Text>{parseLocation(shiftTemplate.location)}</Text>
          <Text>{shiftTemplate.timeStart}</Text>
          <Text>{shiftTemplate.timeEnd}</Text>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Table>
          <thead>
            <tr>
              <th>Rolle</th>
              <th>Antall</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shiftTemplate.shiftSlotTemplates.map(slotTemplate => (
              <ShiftSlotTemplateRow
                key={slotTemplate.id}
                shiftSlotTemplate={slotTemplate}
              />
            ))}
          </tbody>
        </Table>
        <Group position="apart">
          <Group align={'flex-end'}>
            <ShiftRoleSelect value={role} onChangeCallback={setRole} />
            <Button
              variant="subtle"
              leftIcon={<IconPlus />}
              onClick={handleCreateShiftSlotTemplate}
            >
              Legg til rolle
            </Button>
          </Group>
          <Button
            leftIcon={<IconTrash />}
            color="red"
            loading={deleteShiftTemplateLoading}
            onClick={handleDeleteShiftTemplate}
          >
            Slett hele skiftet
          </Button>
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  )
}

import { Button, Group, Modal, NumberInput, Select, Text } from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import { IconPlus, IconTrash } from '@tabler/icons'
import { RoleValues } from 'modules/schedules/consts'
import { useState } from 'react'

interface AddShiftTemplateModalProps {
  open: boolean
  onCloseCallback: () => void
}

type RoleSetting = {
  role: RoleValues
  count: number
}

export const AddShiftTemplateModal: React.FC<AddShiftTemplateModalProps> = ({
  open,
  onCloseCallback,
}) => {
  const [roleSettings, setRoleSettings] = useState<RoleSetting[]>([
    {
      role: RoleValues.BARISTA,
      count: 1,
    },
  ])

  function handleAddEmptyRole() {
    setRoleSettings([
      ...roleSettings,
      {
        role: RoleValues.BARISTA,
        count: 1,
      },
    ])
  }

  function handleRemoveRole(index: number) {
    // Not working as it should

    setRoleSettings(roleSettings.filter((_, i) => i !== index))
  }

  return (
    <Modal
      title="Opprett nytt standarshift"
      opened={open}
      onClose={onCloseCallback}
    >
      <Select label="Dag i uken" data={[]}></Select>
      <TimeInput label="Tidspunkt start"></TimeInput>
      <TimeInput label="Tidspunkt slutt"></TimeInput>

      {roleSettings.map((role, index) => (
        <Group my="sm">
          <Text>{role.role}</Text>
          <NumberInput placeholder="Antall" />
          <IconTrash
            color="red"
            onClick={() => handleRemoveRole(index)}
            style={{ cursor: 'pointer' }}
          />
        </Group>
      ))}
      <Button
        variant="subtle"
        leftIcon={<IconPlus />}
        onClick={handleAddEmptyRole}
      >
        Legg til rolle
      </Button>
      <Group position="right" my="md">
        <Button color="gray" onClick={onCloseCallback}>
          Avbryt
        </Button>
        <Button>Opprett</Button>
      </Group>
    </Modal>
  )
}

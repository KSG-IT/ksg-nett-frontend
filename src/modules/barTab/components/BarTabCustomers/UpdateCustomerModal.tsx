import { Button, Group, Input, Modal, Stack, TextInput } from '@mantine/core'
import { FullContentLoader } from 'components/Loading'
import { BarTabCustomerNode } from 'modules/barTab/types.graphql'
import { useState } from 'react'

interface UpdateCustomerModalProps {
  customer: BarTabCustomerNode | null
  isOpen: boolean
  onCloseCallback: () => void
}

export const UpdateCustomerModal: React.FC<UpdateCustomerModalProps> = ({
  customer,
  isOpen,
  onCloseCallback,
}) => {
  const [name, setName] = useState(customer?.name ?? '')
  const [shortName, setShortName] = useState(customer?.shortName ?? '')
  const [email, setEmail] = useState(customer?.email ?? '')

  if (!customer && isOpen) return <FullContentLoader />

  function handleUpdateCustomer() {
    onCloseCallback()
  }

  return (
    <Modal
      title="Oppdater informasjon"
      opened={isOpen}
      onClose={onCloseCallback}
    >
      <Stack>
        <TextInput
          label="Navn"
          value={name}
          onChange={evt => setName(evt.target.value)}
        />
        <TextInput
          label="Kortnavn"
          value={shortName}
          onChange={evt => setShortName(evt.target.value)}
        />
        <TextInput
          label="Epost"
          value={email}
          onChange={evt => setEmail(evt.target.value)}
        />
        <Group position="right">
          <Button color="gray" onClick={onCloseCallback}>
            Avbryt
          </Button>
          <Button onClick={handleUpdateCustomer}>Lagre</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

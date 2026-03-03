import { AllergyNode } from '../types'
import { Button, MultiSelect, Stack, Title } from '@mantine/core'
import { useState } from 'react'
import { useUserMutations } from '../mutations.hooks'
import { MY_SETTINGS_QUERY } from '../queries'
import { showNotification } from '@mantine/notifications'

interface AllergyTransferListProps {
  userAllergies: AllergyNode[]
  allAllergies: AllergyNode[]
}

export const AllergyTransferList: React.FC<AllergyTransferListProps> = ({
  userAllergies,
  allAllergies,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    userAllergies.map(a => a.id)
  )
  const [isDirty, setIsDirty] = useState(false)

  const { updateMyAllergies, updateMyAllergiesLoading } = useUserMutations()

  function handleChange(values: string[]) {
    setIsDirty(true)
    setSelectedIds(values)
  }

  function handleSave() {
    updateMyAllergies({
      variables: { allergyIds: selectedIds },
      refetchQueries: [MY_SETTINGS_QUERY],
      onCompleted() {
        setIsDirty(false)
        showNotification({
          title: 'Suksess',
          message: 'Allergier oppdatert',
        })
      },
      onError({ message }) {
        showNotification({
          title: 'Noe gikk galt',
          message,
        })
      },
    })
  }

  return (
    <Stack>
      <Title order={3}>Mine allergener</Title>
      <MultiSelect
        label="Mine allergener"
        data={allAllergies.map(a => ({ label: a.name, value: a.id }))}
        value={selectedIds}
        onChange={handleChange}
        placeholder="Velg allergener"
      />
      <Button
        disabled={!isDirty || updateMyAllergiesLoading}
        onClick={handleSave}
      >
        Oppdater
      </Button>
    </Stack>
  )
}

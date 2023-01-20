import { AllergyNode } from '../types'
import {
  Button,
  Stack,
  Title,
  TransferList,
  TransferListData,
} from '@mantine/core'
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
  const [data, setData] = useState<TransferListData>([
    allAllergies
      .filter(
        allergy =>
          !userAllergies.find(userAllergy => userAllergy.id === allergy.id)
      )
      .map(allergy => ({
        label: allergy.name,
        value: allergy.id,
      })),
    userAllergies.map(allergy => ({ label: allergy.name, value: allergy.id })),
  ])
  const [isDirty, setIsDirty] = useState(false)

  const { updateMyAllergies, updateMyAllergiesLoading } = useUserMutations()

  function handleChange(data: TransferListData) {
    setIsDirty(true)
    setData(data)
  }

  function handleSave() {
    updateMyAllergies({
      variables: {
        allergyIds: data[1].map(allergy => allergy.value),
      },
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
      <Title order={3}>Mine allergene</Title>
      <TransferList
        value={data}
        onChange={handleChange}
        nothingFound="Tomt"
        titles={['Alle allergener', 'Mine allergener']}
        breakpoint="sm"
      />
      <Button disabled={!isDirty} onClick={handleSave}>
        Oppdater
      </Button>
    </Stack>
  )
}

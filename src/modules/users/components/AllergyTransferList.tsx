import { AllergyNode } from '../types'
import { Button, Stack, Title } from '@mantine/core'
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
  const [data, setData] = useState<any>([
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

  function handleChange(data: any) {
    setIsDirty(true)
    setData(data)
  }

  function handleSave() {
    updateMyAllergies({
      variables: {
        allergyIds: data[1].map(allergy => allergy.value as string),
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

  /**
   * TODO: https://mantine.dev/combobox/?e=TransferList
   */
  return (
    <Stack>
      <Title order={3}>Mine allergener</Title>
      <Title order={4}>NEEDS REIMPLEMENTATION</Title>
      {/* <TransferList
        value={data}
        onChange={handleChange}
        nothingFound="Tomt"
        titles={['Alle allergener', 'Mine allergener']}
        breakpoint="sm"
      />
      <Button disabled={!isDirty} onClick={handleSave}>
        Oppdater
      </Button> */}
    </Stack>
  )
}

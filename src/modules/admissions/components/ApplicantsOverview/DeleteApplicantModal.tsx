import { FetchResult } from '@apollo/client'
import { Button, Group, LoadingOverlay } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import { DeleteMutationReturns } from 'types/graphql'

interface DeleteApplicantModalProps {
  applicant: CoreApplicantNode | null
  deleteApplicantCallback: () =>
    | Promise<FetchResult<DeleteMutationReturns>>
    | undefined
    | any
  closeModalCallback: () => void
}

export const DeleteApplicantModal: React.FC<DeleteApplicantModalProps> = ({
  applicant,
  deleteApplicantCallback,
  closeModalCallback,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const loadingOverlay = isLoading || applicant === null
  if (loadingOverlay) return <LoadingOverlay visible={loadingOverlay} />

  async function handleDeleteApplicant() {
    setIsLoading(true)
    await deleteApplicantCallback()
      .then(() => {
        closeModalCallback()
      })
      .catch((err: Error) => {
        showNotification({
          title: 'Noe gikk galt',
          message: err.message,
        })
      })
  }

  return (
    <>
      <p>Er du sikker på at du har lyst til å slette {applicant!.fullName}</p>
      <Group>
        <Button
          leftIcon={<IconTrash />}
          color="red"
          onClick={handleDeleteApplicant}
        >
          Slett
        </Button>
        <Button onClick={closeModalCallback}>Avbryt</Button>
      </Group>
    </>
  )
}

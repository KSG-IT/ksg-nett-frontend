import { FetchResult } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Group, LoadingOverlay } from '@mantine/core'
import { CoreApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import toast from 'react-hot-toast'
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
      .catch(() => {
        toast.error('Noe gikk galt')
      })
  }

  return (
    <>
      <p>Er du sikker på at du har lyst til å slette {applicant.fullName}</p>
      <Group>
        <Button
          leftIcon={<FontAwesomeIcon icon="trash" />}
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

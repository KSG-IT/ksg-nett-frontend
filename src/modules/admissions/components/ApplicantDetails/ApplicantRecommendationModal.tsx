import { gql, useMutation } from '@apollo/client'
import { Button, Modal, Stack, Textarea } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { InternalGroupSelect } from 'components/Select'
import { useState } from 'react'

const CREATE_APPLICANT_RECOMMENDATION_MUTATION = gql`
  mutation CreateApplicantRecommendation(
    $applicant: ID!
    $internalGroup: ID!
    $reasoning: String!
  ) {
    createApplicantRecommendation(
      input: {
        applicant: $applicant
        internalGroup: $internalGroup
        reasoning: $reasoning
      }
    ) {
      applicantRecommendation {
        id
      }
    }
  }
`

interface CreateApplicantRecommendationVariables {
  applicant: string
  internalGroup: string
  reasoning: string
}

interface CreateApplicantRecommendationReturns {
  createApplicantRecommendation: {
    applicantRecommendation: {
      id: string
    }
  }
}

function useApplicantRecommendationMutations() {
  const [
    createApplicantRecommendation,
    { loading: createApplicantRecommendationLoading },
  ] = useMutation<
    CreateApplicantRecommendationReturns,
    CreateApplicantRecommendationVariables
  >(CREATE_APPLICANT_RECOMMENDATION_MUTATION)

  return {
    createApplicantRecommendation,
    createApplicantRecommendationLoading,
  }
}

interface ApplicantRecommendationModalProps {
  applicantId: string
  isOpen: boolean
  onClose: () => void
}

export const ApplicantRecommendationModal: React.FC<
  ApplicantRecommendationModalProps
> = ({ applicantId, isOpen, onClose }) => {
  const [internalGroup, setInternalGroup] = useState('')
  const [reasoning, setReasoning] = useState('')
  const { createApplicantRecommendation } =
    useApplicantRecommendationMutations()

  function handleSubmit() {
    createApplicantRecommendation({
      variables: {
        applicant: applicantId,
        internalGroup,
        reasoning,
      },
      onCompleted() {
        setInternalGroup('')
        setReasoning('')
        showNotification({
          title: 'Sukess',
          message: 'Anbefalingen ble lagret',
        })
        onClose()
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
    <Modal opened={isOpen} onClose={onClose} title="Anbefaling" size="md">
      <Stack>
        <InternalGroupSelect
          setInternalGroupCallback={(internalGroup: string) =>
            setInternalGroup(internalGroup)
          }
        />

        <Textarea
          value={reasoning}
          required
          label="Begrunnelse"
          placeholder="Skriv en begrunnelse"
          minRows={6}
          onChange={event => setReasoning(event.currentTarget.value)}
        />

        <Button disabled={internalGroup === ''} onClick={handleSubmit}>
          Anbefal
        </Button>
      </Stack>
    </Modal>
  )
}

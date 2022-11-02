import { useMutation, useQuery } from '@apollo/client'
import { Alert, Button, Group, Stack, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons'
import { ApplicantStatusValues } from 'modules/admissions/consts'
import {
  ADD_INTERNAL_GROUP_POSITION_PRIORITY,
  DELETE_INTERNAL_GROUP_POSITION_PRIORITY,
} from 'modules/admissions/mutations'
import { usePatchApplicant } from 'modules/admissions/mutations.hooks'
import { INTERNAL_GROUP_POSITIONS_AVAILABLE_FOR_APPLICANTS_QUERY } from 'modules/admissions/queries'
import {
  AddInternalGroupPositionPriorityReturns,
  AddInternalGroupPositionPriorityVariables,
  ApplicantNode,
  InternalGroupPositionPriorityNode,
  InternalGroupPositionsAvailableForApplicantReturns,
} from 'modules/admissions/types.graphql'
import { useEffect, useState } from 'react'

interface InternalGroupPosition {
  id: string
  name: string
}

interface SetPrioritiesProps {
  applicant: ApplicantNode
  nextStepCallback: () => void
}

export const SetPriorities: React.VFC<SetPrioritiesProps> = ({
  applicant,
  nextStepCallback,
}) => {
  // === Local state variables ===
  // Initial priority state are applicant non-null priorities
  const [priorities, setPriorities] = useState<
    InternalGroupPositionPriorityNode[]
  >(
    applicant.priorities.filter(
      priority => priority !== null
    ) as InternalGroupPositionPriorityNode[]
  )
  const [internalGroupPositions, setInternalGroupPositions] = useState<
    InternalGroupPosition[]
  >([])
  const [filteredInternalGroupPositions, setFilteredInternalGroupPositions] =
    useState<InternalGroupPosition[]>([])

  useEffect(() => {
    // We handle what internal group positions we want to display for the user
    const filteredPriorities = applicant.priorities.filter(
      priority => priority !== null
    )
    const priorityIds = filteredPriorities.map(
      priority => priority!.internalGroupPosition.id
    )
    const availableInternalGroupPositions = internalGroupPositions.filter(
      position => !priorityIds.includes(position.id)
    )

    // Filtered positions are those which are available for the user to add to their priority listing
    setFilteredInternalGroupPositions(availableInternalGroupPositions)
    setPriorities(filteredPriorities as InternalGroupPositionPriorityNode[])
  }, [applicant.priorities, internalGroupPositions])

  // === Queries and mutations ===
  useQuery<InternalGroupPositionsAvailableForApplicantReturns>(
    INTERNAL_GROUP_POSITIONS_AVAILABLE_FOR_APPLICANTS_QUERY,
    {
      onCompleted(data) {
        const { internalGroupPositionsAvailableForApplicants } = data
        setInternalGroupPositions(internalGroupPositionsAvailableForApplicants)
      },
    }
  )

  // Saves priorities and moves the applicant to the interview booking phase
  const { patchApplicant } = usePatchApplicant()

  const [deleteInternalGroupPriority] = useMutation(
    DELETE_INTERNAL_GROUP_POSITION_PRIORITY,
    { refetchQueries: ['GetApplicantFromToken'] }
  )

  const [addPriority] = useMutation<
    AddInternalGroupPositionPriorityReturns,
    AddInternalGroupPositionPriorityVariables
  >(ADD_INTERNAL_GROUP_POSITION_PRIORITY, {
    refetchQueries: ['GetApplicantFromToken'],
  })

  //  === Handlers ===
  const handleAddPriority = (internal_group_position_id: string) => {
    addPriority({
      variables: {
        internalGroupPositionId: internal_group_position_id,
        applicantId: applicant.id,
      },
    })
  }

  const handleDeletePriority = (priorityId: string) => {
    deleteInternalGroupPriority({ variables: { id: priorityId } })
  }

  const handleNextStep = () => {
    patchApplicant({
      variables: {
        id: applicant.id,
        input: {
          status: ApplicantStatusValues.HAS_SET_PRIORITIES,
        },
      },
      refetchQueries: ['GetApplicantFromToken'],
      onCompleted() {
        showNotification({
          title: 'Lagret prioriteringer',
          message: 'Du har nå lagret dine prioriteringer',
        })
        nextStepCallback()
      },
      onError() {
        showNotification({
          title: 'Kunne ikke lagre prioriteringer',
          message: 'Noe gikk galt under lagring av prioriteringer',
        })
      },
    })
  }

  // ToDo move this to local state and update in useEffect
  const canMoveOn = priorities.length > 0
  const canAddPriority = priorities.length < 3

  return (
    <Stack style={{ maxWidth: 900 }}>
      <Alert color="blue">
        Du må minst ha 1 stilling før du kan booke intervju, og kan ikke ha mer
        enn 3.
      </Alert>
      {priorities.map(priority => {
        return (
          <Group position="apart">
            <Text>{priority.internalGroupPosition.name}</Text>
            <Button
              color="red"
              leftIcon={<IconTrash />}
              onClick={() => {
                handleDeletePriority(priority.id)
              }}
            >
              Slett prioritet
            </Button>
          </Group>
        )
      })}
      <Stack>
        <Title order={3}>Tilgjengelige stillinger</Title>
        <Group>
          {filteredInternalGroupPositions.map(position => (
            <Button
              key={position.name}
              color="green"
              onClick={() => {
                handleAddPriority(position.id)
              }}
              disabled={!canAddPriority}
            >
              {position.name}
            </Button>
          ))}
        </Group>
      </Stack>

      <Button
        onClick={handleNextStep}
        disabled={!canMoveOn}
        color="samfundet-red"
      >
        Book intervju
      </Button>
    </Stack>
  )
}

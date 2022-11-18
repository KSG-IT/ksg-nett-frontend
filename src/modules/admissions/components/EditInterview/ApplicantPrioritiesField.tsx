import { Button, Group, Stack, Text } from '@mantine/core'
import { useApplicantMutations } from 'modules/admissions/mutations.hooks'
import { ApplicantNode } from 'modules/admissions/types.graphql'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface ApplicantPrioritiesFieldProps {
  applicant: Pick<ApplicantNode, 'id' | 'priorities'>
}

export const ApplicantPrioritiesField: React.VFC<
  ApplicantPrioritiesFieldProps
> = ({ applicant }) => {
  const [priorities, setPriorities] = useState(applicant.priorities)

  const { updateInternalGroupPositionPriorityOrder } = useApplicantMutations()

  const renderChangePriorityButtons = (index: number) => {
    const moveUp = index > 0
    const moveDown = index < 2

    return (
      <Group>
        {moveUp && (
          <Button onClick={() => handlePriorityChange(index, -1)}>
            Flytt opp
          </Button>
        )}
        {moveDown && (
          <Button onClick={() => handlePriorityChange(index, +1)}>
            Flytt ned
          </Button>
        )}
      </Group>
    )
  }

  function handlePriorityChange(index: number, direction: -1 | 1) {
    const newIndex = index + direction

    const newPriorities = [...priorities]
    const [oldPriority] = newPriorities.splice(newIndex, 1, priorities[index])
    newPriorities.splice(index, 1, oldPriority)

    setPriorities(newPriorities)
  }

  function updatePriorities() {
    const filteredPriorities = priorities.filter(priority => priority !== null)

    const priorityOrder = filteredPriorities.map(
      priority => priority!.internalGroupPosition.id
    )

    updateInternalGroupPositionPriorityOrder({
      variables: {
        applicantId: applicant.id,
        priorityOrder: priorityOrder,
      },
    })
      .then(() => {
        toast.success('Prioriteringene er oppdatert')
      })
      .catch(error => {
        toast.error(error.message)
      })
  }

  return (
    <Stack>
      <Text size="lg" weight="bold">
        Kandidat prioriteringer
      </Text>
      {priorities.map((priority, index) => {
        if (priority === null) return
        return (
          <Group key={index}>
            {index + 1}. {priority?.internalGroupPosition.name}
            {renderChangePriorityButtons(index)}
          </Group>
        )
      })}

      <Group>
        <Button onClick={updatePriorities}>Lagre prioriteringer</Button>
      </Group>
    </Stack>
  )
}

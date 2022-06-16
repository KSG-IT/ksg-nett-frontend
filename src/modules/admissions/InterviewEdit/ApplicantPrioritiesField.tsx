import { Group, Stack, Text } from '@mantine/core'
import { ApplicantNode, InternalGroupPositionPriority } from '../types'

interface ApplicantPrioritiesFieldProps {
  applicant: Pick<ApplicantNode, 'id' | 'priorities'>
}

export const ApplicantPrioritiesField: React.VFC<
  ApplicantPrioritiesFieldProps
> = ({ applicant }) => {
  const renderChangePriorityButtons = (
    index: number,
    priority: InternalGroupPositionPriority
  ) => {
    const moveUp = index > 0
    const moveDown = index < 2

    return (
      <Group>
        <button>Flytt opp</button>
        <button>Flytt ned</button>
      </Group>
    )
  }

  return (
    <Stack>
      <Text size="lg" weight="bold">
        Kandidat prioriteringer
      </Text>
      {applicant.priorities.map((priority, index) => {
        if (priority === null) return
        return (
          <Group key={index}>
            {index + 1}. {priority?.internalGroupPosition.name}{' '}
            {renderChangePriorityButtons(index, priority)}
          </Group>
        )
      })}
    </Stack>
  )
}

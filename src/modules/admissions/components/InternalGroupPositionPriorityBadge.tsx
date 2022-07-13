import { Badge } from '@mantine/core'
import { InternalGroupPositionPriorityInternalGroupPriorityValues } from 'modules/admissions/consts'
import { parseInternalGroupPositionPriority } from 'modules/admissions/parsing'
import { InternalGroupPositionPriorityNode } from 'modules/admissions/types.graphql'

interface InternalGroupPositionPriorityBadgeProps {
  priority: InternalGroupPositionPriorityNode
}

const resolvePriorityColor = (
  internalGroupPriority: InternalGroupPositionPriorityInternalGroupPriorityValues
) => {
  switch (internalGroupPriority) {
    case 'WANT':
      return 'green'
    case 'CURRENTLY_DISCUSSING':
      return 'blue'
    case 'PROBABLY_WANT':
      return 'orange'
    case 'INTERESTED':
      return 'grape'
    case 'RESERVE':
      return 'yellow'
    case 'DO_NOT_WANT':
      return 'red'
    case 'PASS_AROUND':
      return 'pink'
    case null:
      return 'gray'
  }
}

export const InternalGroupPositionPriorityBadge: React.VFC<
  InternalGroupPositionPriorityBadgeProps
> = ({ priority }) => {
  const { internalGroupPriority } = priority

  const badgeColor = resolvePriorityColor(internalGroupPriority)

  return (
    <Badge color={badgeColor}>
      {parseInternalGroupPositionPriority(internalGroupPriority)}
    </Badge>
  )
}

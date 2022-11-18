import { internalGroupPositionTypeOptions } from './consts'
import { InternalGroupPositionType } from './types.graphql'

export function getInternalGroupPositionTypeLabel(
  internalGroupPositionType: InternalGroupPositionType
): string {
  const option = internalGroupPositionTypeOptions.find(
    option => option.value === internalGroupPositionType
  )
  return option ? option.label : ''
}

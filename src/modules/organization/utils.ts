import { internalGroupPositionTypeOptions } from './consts'
import {
  InternalGroupPositionType,
  InternalGroupPositionsByInternalGroupReturns,
} from './types.graphql'

export function getInternalGroupPositionTypeLabel(
  internalGroupPositionType: InternalGroupPositionType
): string {
  const option = internalGroupPositionTypeOptions.find(
    option => option.value === internalGroupPositionType
  )
  return option ? option.label : ''
}

export interface InternalGroupPositionOption {
  value: string
  label: string
}

export const internalGroupPositionsByInternalGroupToSelectOption = (
  positions?: InternalGroupPositionsByInternalGroupReturns['internalGroupPositionsByInternalGroup']
): InternalGroupPositionOption[] =>
  positions?.map(node => ({
    value: node.id,
    label: node.name,
  })) || []

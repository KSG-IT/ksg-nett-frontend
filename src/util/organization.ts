import {
  InternalGroupNode,
  InternalGroupPositionNode,
} from 'modules/organization/types'

interface SelectOption {
  value: string
  label: string
}

export const internalGroupToSelectOptions = (
  allInternalGroups?: InternalGroupNode[]
): SelectOption[] =>
  allInternalGroups?.map(internalGroup => ({
    value: internalGroup.id,
    label: internalGroup.name,
  })) || []

export const internalGroupPositionToSelectOptions = (
  allInternalGroups?: InternalGroupPositionNode[]
): SelectOption[] =>
  allInternalGroups?.map(internalGroupPosition => ({
    value: internalGroupPosition.id,
    label: internalGroupPosition.name,
  })) || []

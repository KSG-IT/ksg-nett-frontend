import {
  AllInternalGroupPositionsReturns,
  AllInternalGroupsReturns,
} from 'modules/organization/types'

interface SelectOption {
  value: string
  label: string
}

export const internalGroupToSelectOptions = (
  allInternalGroups?: AllInternalGroupsReturns['allInternalGroups']
): SelectOption[] =>
  allInternalGroups?.map(internalGroup => ({
    value: internalGroup.id,
    label: internalGroup.name,
  })) || []

export const internalGroupPositionToSelectOptions = (
  allInternalGroups?: AllInternalGroupPositionsReturns['allInternalGroupPositions']
): SelectOption[] =>
  allInternalGroups?.map(internalGroupPosition => ({
    value: internalGroupPosition.id,
    label: internalGroupPosition.name,
  })) || []

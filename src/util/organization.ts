import { AllInternalGroupsReturns } from 'modules/organization/types'

export interface InternalGroupOption {
  value: string
  label: string
}

export const internalGroupToSelectOptions = (
  allInternalGroups?: AllInternalGroupsReturns['allInternalGroups']
): InternalGroupOption[] =>
  allInternalGroups?.map(internalGroup => ({
    value: internalGroup.id,
    label: internalGroup.name,
  })) || []

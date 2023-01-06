import { useMutation } from '@apollo/client'
import {
  PATCH_INTERNAL_GROUP_MUTATION,
  PATCH_INTERNAL_GROUP_POSITION_MEMBERSHIP_MUTATION,
  QUIT_KSG_MUTATION,
} from './mutations'
import { PatchInternalGroupReturns, PatchInternalGroupVariables } from './types'
import {
  PatchInternalGroupPositionMembershipReturns,
  PatchInternalGroupPositionMembershipVariables,
  QuitKSGReturns,
  QuitKSGVariables,
} from './types.graphql'

export function useInternalGroupMutations() {
  const [patchInternalGroup, { loading: patchInternalGroupLoading }] =
    useMutation<PatchInternalGroupReturns, PatchInternalGroupVariables>(
      PATCH_INTERNAL_GROUP_MUTATION
    )

  return {
    patchInternalGroup,
    patchInternalGroupLoading,
  }
}

export function useInternalGroupPositionMembershipMutations() {
  const [
    patchInternalGroupPositionMembership,
    { loading: patchInternalGroupPositionMembershipLoading },
  ] = useMutation<
    PatchInternalGroupPositionMembershipReturns,
    PatchInternalGroupPositionMembershipVariables
  >(PATCH_INTERNAL_GROUP_POSITION_MEMBERSHIP_MUTATION)

  const [quitKSG, { loading: quitKSGLoading }] = useMutation<
    QuitKSGReturns,
    QuitKSGVariables
  >(QUIT_KSG_MUTATION)

  return {
    patchInternalGroupPositionMembership,
    patchInternalGroupPositionMembershipLoading,
    quitKSG,
    quitKSGLoading,
  }
}

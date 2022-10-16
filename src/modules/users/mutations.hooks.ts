import { useMutation } from '@apollo/client'
import { PATCH_USER_MUTATION } from './mutations'
import { UserNode } from './types'

type PatchUserInput = Partial<
  Omit<UserNode, 'id' | 'dateOfBirth' | 'profileImage'>
>

interface PatchUserVariables {
  id: string
  input: PatchUserInput
}

interface PatchUserReturns {
  user: Pick<UserNode, 'id'>
}

export function useUserMutations() {
  const [patchUser, { loading: patchUserLoading, error: patchUserError }] =
    useMutation<PatchUserReturns, PatchUserVariables>(PATCH_USER_MUTATION)

  return {
    patchUser,
    patchUserLoading,
    patchUserError,
  }
}

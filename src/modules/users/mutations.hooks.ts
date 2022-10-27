import { useMutation } from '@apollo/client'
import { PATCH_USER_MUTATION, UPDATE_MY_INFO_MUTATION } from './mutations'
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

interface UpdateMyInfoReturns {
  user: Pick<UserNode, 'id'>
}
interface UpdateMyInfoVariables {
  firstName: string
  nickname: string
  lastName: string
  phone: string
  study: string
  studyAddress: string
  homeTown: string
  dateOfBirth: string
  cardUuid: string
}

export function useUserMutations() {
  const [patchUser, { loading: patchUserLoading, error: patchUserError }] =
    useMutation<PatchUserReturns, PatchUserVariables>(PATCH_USER_MUTATION)

  const [
    updateMyInfo,
    { loading: updateMyInfoLoading, error: updateMyInfoError },
  ] = useMutation<UpdateMyInfoReturns, UpdateMyInfoVariables>(
    UPDATE_MY_INFO_MUTATION
  )

  return {
    patchUser,
    patchUserLoading,
    patchUserError,
    updateMyInfo,
    updateMyInfoLoading,
    updateMyInfoError,
  }
}

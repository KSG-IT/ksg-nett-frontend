import { useMutation } from '@apollo/client'
import {
  ADD_USER_TO_USER_TYPE_MUTATION,
  PATCH_USER_MUTATION,
  REMOVE_USER_FROM_USER_TYPE_MUTATION,
  UPDATE_MY_INFO_MUTATION,
} from './mutations'
import {
  AddUserToUserTypeReturns,
  AddUserToUserTypeVariables,
  RemoveUserFromUserTypeReturns,
  RemoveUserFromUserTypeVariables,
  UserNode,
} from './types'

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

export function useUserTypeMutations() {
  const [addUserToUserType, { loading: addUserToUserTypeLoading }] =
    useMutation<AddUserToUserTypeReturns, AddUserToUserTypeVariables>(
      ADD_USER_TO_USER_TYPE_MUTATION
    )

  const [removeUserFromUserType, { loading: removeUserFromUserTypeLoading }] =
    useMutation<RemoveUserFromUserTypeReturns, RemoveUserFromUserTypeVariables>(
      REMOVE_USER_FROM_USER_TYPE_MUTATION
    )

  return {
    addUserToUserType,
    addUserToUserTypeLoading,
    removeUserFromUserType,
    removeUserFromUserTypeLoading,
  }
}

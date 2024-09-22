import { useMutation } from '@apollo/client'
import {
  ADD_USER_TO_USER_TYPE_MUTATION,
  INVITE_NEW_USER_MUTATION,
  PATCH_USER_MUTATION,
  REMOVE_USER_FROM_USER_TYPE_MUTATION,
  UPDATE_ABOUT_ME_MUTATION,
  UPDATE_MY_ADDRESS_MUTATION,
  UPDATE_MY_ALLERGIES_MUTATION,
  UPDATE_MY_EMAIL_NOTIFICATIONS_MUTATION,
  UPDATE_MY_INFO_MUTATION,
} from './mutations'
import {
  AddUserToUserTypeReturns,
  AddUserToUserTypeVariables,
  RemoveUserFromUserTypeReturns,
  RemoveUserFromUserTypeVariables,
  UpdateAboutMeReturns,
  UpdateAboutMeVariables,
  UpdateMyAddressReturns,
  UpdateMyAddressVariables,
  UpdateMyAllergiesReturns,
  UpdateMyAllergiesVariables,
  UpdateMyEmailNotificationsReturns,
  UpdateMyEmailNotificationsVariables,
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

interface InviteNewUserVariables {
  email: string
  firstName: string
  lastName: string
  sendWelcomeEmail: boolean
}

interface InviteNewUserReturns {
  inviteNewUser: {
    user: Pick<UserNode, 'id' | 'email' | 'firstName' | 'lastName'>
  }
}

export function useUserMutations() {
  const [
    inviteNewUser,
    { loading: inviteNewUserLoading, error: inviteNewUserError },
  ] = useMutation<InviteNewUserReturns, InviteNewUserVariables>(
    INVITE_NEW_USER_MUTATION
  )
  const [patchUser, { loading: patchUserLoading, error: patchUserError }] =
    useMutation<PatchUserReturns, PatchUserVariables>(PATCH_USER_MUTATION)

  const [
    updateMyInfo,
    { loading: updateMyInfoLoading, error: updateMyInfoError },
  ] = useMutation<UpdateMyInfoReturns, UpdateMyInfoVariables>(
    UPDATE_MY_INFO_MUTATION
  )

  const [updateAboutMe, { loading: updateAboutMeLoading }] = useMutation<
    UpdateAboutMeReturns,
    UpdateAboutMeVariables
  >(UPDATE_ABOUT_ME_MUTATION)

  const [updateMyAllergies, { loading: updateMyAllergiesLoading }] =
    useMutation<UpdateMyAllergiesReturns, UpdateMyAllergiesVariables>(
      UPDATE_MY_ALLERGIES_MUTATION
    )

  const [
    updateMyEmailNotifications,
    { loading: updateMyEmailNotificationsLoading },
  ] = useMutation<
    UpdateMyEmailNotificationsReturns,
    UpdateMyEmailNotificationsVariables
  >(UPDATE_MY_EMAIL_NOTIFICATIONS_MUTATION)

  const [updateMyAddress, { loading: updateMyAddressLoading }] = useMutation<
    UpdateMyAddressReturns,
    UpdateMyAddressVariables
  >(UPDATE_MY_ADDRESS_MUTATION)

  return {
    inviteNewUser,
    inviteNewUserLoading,
    inviteNewUserError,
    patchUser,
    patchUserLoading,
    patchUserError,
    updateMyInfo,
    updateMyInfoLoading,
    updateMyInfoError,
    updateAboutMe,
    updateAboutMeLoading,
    updateMyAllergies,
    updateMyAllergiesLoading,
    updateMyEmailNotifications,
    updateMyEmailNotificationsLoading,
    updateMyAddress,
    updateMyAddressLoading,
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

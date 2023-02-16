import { useMutation } from '@apollo/client'
import {
  ADD_USER_TO_USER_TYPE_MUTATION,
  PATCH_USER_MUTATION,
  REMOVE_USER_FROM_USER_TYPE_MUTATION,
  UPDATE_ABOUT_ME_MUTATION,
  UPDATE_MY_ALLERGIES_MUTATION,
  UPDATE_MY_EMAIL_NOTIFICATIONS_MUTATION,
  UPDATE_MY_INFO_MUTATION,
  UPDATE_MY_THEME_MUTATION,
} from './mutations'
import {
  AddUserToUserTypeReturns,
  AddUserToUserTypeVariables,
  RemoveUserFromUserTypeReturns,
  RemoveUserFromUserTypeVariables,
  UpdateAboutMeReturns,
  UpdateAboutMeVariables,
  UpdateMyAllergiesReturns,
  UpdateMyAllergiesVariables,
  UpdateMyEmailNotificationsReturns,
  UpdateMyEmailNotificationsVariables,
  UpdateMyThemeReturns,
  UpdateMyThemeVariables,
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

  const [updateMyTheme, { loading: updateMyThemeLoading }] = useMutation<
    UpdateMyThemeReturns,
    UpdateMyThemeVariables
  >(UPDATE_MY_THEME_MUTATION)

  return {
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
    updateMyTheme,
    updateMyThemeLoading,
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

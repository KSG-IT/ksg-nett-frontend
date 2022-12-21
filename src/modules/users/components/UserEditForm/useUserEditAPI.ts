import { useUserMutations } from 'modules/users/mutations.hooks'
import { USER_QUERY } from 'modules/users/queries'
import { UserNode } from 'modules/users/types'
import { UserProfileCleanedData } from './useUserEditLogic'
import { showNotification } from '@mantine/notifications'
import { closeAllModals } from '@mantine/modals'

interface EditProfileApiProps {
  user: UserNode
  onCompletedCallback: () => void
}

export function useEditProfileAPI(input: EditProfileApiProps) {
  const { user, onCompletedCallback } = input
  const { patchUser } = useUserMutations()

  async function handleSubmit(data: UserProfileCleanedData) {
    const { id } = user
    const input = {
      ...data,
    }

    if (!input.profileImage) {
      delete input.profileImage
    }
    return patchUser({
      variables: {
        id: id,
        input: input,
      },
      refetchQueries: [USER_QUERY],
      onCompleted: data => {
        showNotification({
          title: 'Vellykket',
          message: 'Profilen har blitt oppdatert',
          color: 'green',
        })
        onCompletedCallback()
      },
    })
  }

  const defaultValues = {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    nickname: user?.nickname ?? 'drit',
    homeTown: user?.homeTown ?? '',
    studyAddress: user?.studyAddress ?? '',
    study: user?.study ?? '',
    dateOfBirth: new Date(user?.dateOfBirth) ?? new Date(),
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    profileImage: null,
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}

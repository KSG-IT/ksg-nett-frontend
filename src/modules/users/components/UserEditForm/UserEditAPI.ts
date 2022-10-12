import { useUserMutations } from 'modules/users/mutations.hooks'
import { USER_QUERY } from 'modules/users/queries'
import { UserNode } from 'modules/users/types'
import { UserProfileCleanedData } from './UserEditLogic'

export function useEditProfileAPI(user: UserNode) {
  const { patchUser } = useUserMutations()

  async function handleSubmit(data: UserProfileCleanedData) {
    const { id } = user
    const input = {
      ...data,
    }
    return patchUser({
      variables: {
        id: id,
        input: input,
      },
      refetchQueries: [USER_QUERY],
    })
  }

  const defaultValues = {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    studyAddress: user?.studyAddress ?? '',
    study: user?.study ?? '',
    dateOfBirth: new Date(user?.dateOfBirth) ?? new Date(),
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    biography: user?.biography ?? '',
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}
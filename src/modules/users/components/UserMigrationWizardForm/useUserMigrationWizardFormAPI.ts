import { useUserMutations } from 'modules/users/mutations.hooks'
import { ME_QUERY } from 'modules/users/queries'
import { useNavigate } from 'react-router-dom'
import { UserWizardData } from './types'
import {
  UseUserMigrationWizardFormAPIData,
  UseUserMigrationWizardFormData,
} from './useUserMigrationWizardFormLogic'
import { showNotification, updateNotification } from '@mantine/notifications'

type UseUserMigrationWizardFormAPIInput = {
  user: UserWizardData
}

export function useUserMigrationWizardFormAPI({
  user,
}: UseUserMigrationWizardFormAPIInput) {
  const { updateMyInfo } = useUserMutations()
  const navigte = useNavigate()

  async function handleSubmit(data: UseUserMigrationWizardFormAPIData) {
    return await updateMyInfo({
      variables: {
        ...data,
      },
      awaitRefetchQueries: true,
      refetchQueries: [ME_QUERY],
      onCompleted() {
        showNotification({
          title: 'Oppdatert',
          message: 'Brukerinformasjonen din er oppdatert',
          color: 'green',
        })
        navigte('/dashboard')
      },
      onError() {
        showNotification({
          title: 'Noe gikk galt',
          message: 'Kunne ikke oppdatere bruker',
          color: 'red',
        })
      },
    })
  }

  const defaultValues: UseUserMigrationWizardFormData = {
    firstName: user.firstName ?? '',
    nickname: user.nickname ?? '',
    lastName: user.lastName ?? '',
    study: user.study ?? '',
    phone: user.phone ?? '',

    dateOfBirth: new Date(user.dateOfBirth) ?? new Date(),
    homeTown: user.homeTown ?? '',
    studyAddress: user.studyAddress ?? '',
    cardUuid: user.bankAccount?.cardUuid ?? '',
  }
  return {
    defaultValues,
    onSubmit: handleSubmit,
  }
}

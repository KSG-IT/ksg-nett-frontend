import { yupResolver } from '@hookform/resolvers/yup'
import { formatISO } from 'date-fns'
import { PatchUserReturns } from 'modules/users/types'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import { format } from 'util/date-fns'

import * as yup from 'yup'
export type UseUserMigrationWizardFormAPIData = {
  firstName: string
  lastName: string
  nickname: string
  dateOfBirth: string // String here
  homeTown: string
  studyAddress: string
  cardUuid: string
  phone: string
  study: string
}

export type UseUserMigrationWizardFormData = {
  // What we enforce in the form is not the same as what we send to the server
  firstName: string
  lastName: string
  nickname: string
  dateOfBirth: Date // Date here
  homeTown: string
  studyAddress: string
  phone: string
  study: string
  cardUuid: string
}

const UserEditSchema = yup.object().shape({
  firstName: yup.string().required('Fornavn må fylles ut'),
  lastName: yup.string().required('Etternavn må fylles ut'),
  studyAddress: yup.string().required('Adresse må fylles ut'),
  homeTown: yup.string().required('Hjemby må fylles ut'),
  study: yup.string().required('Studie må fylles ut'),
  dateOfBirth: yup.date().required('Fødselsdato må fylles ut'),
  phone: yup.string().required('Telefonnummer må fylles ut'),
})

export interface UseUserMigrationWizardFormLogicInput {
  defaultValues: UseUserMigrationWizardFormData
  onSubmit: OnFormSubmit<UseUserMigrationWizardFormAPIData, PatchUserReturns>
}
export function useUserMigrationWizardFormLogic(
  input: UseUserMigrationWizardFormLogicInput
) {
  const { defaultValues, onSubmit } = input
  const form = useForm<UseUserMigrationWizardFormData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(UserEditSchema),
  })

  async function handleSubmit(data: UseUserMigrationWizardFormData) {
    const { dateOfBirth } = data
    const cleanedDate = format(dateOfBirth, 'yyyy-MM-dd')
    await onSubmit({
      ...data,
      dateOfBirth: cleanedDate,
    })
  }

  return {
    form,
    onSubmit: handleSubmit,
  }
}

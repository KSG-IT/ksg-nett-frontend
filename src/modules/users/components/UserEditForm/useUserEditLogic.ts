import { yupResolver } from '@hookform/resolvers/yup'
import { PatchUserReturns } from 'modules/users/types'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import { FILE_SIZE } from 'util/consts'
import { format } from 'util/date-fns'
import * as yup from 'yup'

export type UserProfileFormData = {
  firstName: string
  lastName: string
  nickname: string
  studyAddress: string
  homeTown: string
  study: string
  dateOfBirth: Date
  phone: string
  email: string
  profileImage?: File | null
}

export type UserProfileCleanedData = Omit<
  UserProfileFormData,
  'dateOfBirth'
> & {
  dateOfBirth: string
}

const UserEditSchema = yup.object().shape({
  firstName: yup.string().required('Fornavn må fylles ut'),
  lastName: yup.string().required('Etternavn må fylles ut'),
  nickname: yup.string().nullable().notRequired(),
  studyAddress: yup.string().required('Adresse må fylles ut'),
  homeTown: yup.string().required('Hjemby må fylles ut'),
  study: yup.string().required('Studie må fylles ut'),
  dateOfBirth: yup.date().required('Fødselsdato må fylles ut'),
  phone: yup.string().required('Telefonnummer må fylles ut'),
  email: yup.string().required('E-post må fylles ut'),
  profileImage: yup
    .mixed()
    .nullable()
    .notRequired()
    .test(
      'FILE_SIZE',
      'Filstørrelse for stor, 1 MB maks.',
      value => !value || (value && value.size <= FILE_SIZE)
    ),
})

interface UseEditLogicInput {
  defaultValues: UserProfileFormData
  onSubmit: OnFormSubmit<UserProfileCleanedData, PatchUserReturns>
  onCompletedCallback: () => void
}

export function useEditProfileLogic(input: UseEditLogicInput) {
  const { defaultValues, onSubmit, onCompletedCallback } = input
  const form = useForm<UserProfileFormData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(UserEditSchema),
  })

  const handleSubmit = async (data: UserProfileFormData) => {
    const cleanedData = {
      ...data,
      dateOfBirth: format(new Date(data.dateOfBirth), 'yyyy-MM-dd'),
    }
    await onSubmit(cleanedData)
  }

  return {
    form,
    onSubmit: handleSubmit,
  }
}

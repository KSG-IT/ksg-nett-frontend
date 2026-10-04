import { zodResolver } from '@hookform/resolvers/zod'
import { PatchUserReturns } from 'modules/users/types'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import { maxFileSize, requiredIsoDate, requiredString } from 'util/validation'
import { z } from 'zod'

const UserEditSchema = z.object({
  firstName: requiredString('Fornavn må fylles ut'),
  lastName: requiredString('Etternavn må fylles ut'),
  nickname: z.string(),
  studyAddress: requiredString('Adresse må fylles ut'),
  homeTown: requiredString('Hjemby må fylles ut'),
  study: requiredString('Studie må fylles ut'),
  dateOfBirth: requiredIsoDate('Fødselsdato må fylles ut'),
  phone: requiredString('Telefonnummer må fylles ut'),
  email: requiredString('E-post må fylles ut'),
  profileImage: maxFileSize(),
})

export type UserProfileFormValues = z.input<typeof UserEditSchema>
export type UserProfileCleanedData = z.output<typeof UserEditSchema>

interface UseEditLogicInput {
  defaultValues: UserProfileFormValues
  onSubmit: OnFormSubmit<UserProfileCleanedData, PatchUserReturns>
  onCompletedCallback: () => void
}

export function useEditProfileLogic(input: UseEditLogicInput) {
  const { defaultValues, onSubmit, onCompletedCallback } = input
  const form = useForm<UserProfileFormValues, unknown, UserProfileCleanedData>({
    mode: 'onSubmit',
    defaultValues,
    resolver: zodResolver(UserEditSchema),
  })

  const handleSubmit = async (data: UserProfileCleanedData) => {
    await onSubmit(data)
  }

  return {
    form,
    onSubmit: handleSubmit,
  }
}

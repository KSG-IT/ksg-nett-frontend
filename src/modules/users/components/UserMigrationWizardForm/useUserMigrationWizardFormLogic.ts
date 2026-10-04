import { zodResolver } from '@hookform/resolvers/zod'
import { PatchUserReturns } from 'modules/users/types'
import { useForm } from 'react-hook-form'
import { OnFormSubmit } from 'types/forms'
import { requiredIsoDate, requiredString } from 'util/validation'
import { z } from 'zod'

const UserMigrationSchema = z.object({
  firstName: requiredString('Fornavn må fylles ut'),
  lastName: requiredString('Etternavn må fylles ut'),
  nickname: z.string(),
  studyAddress: requiredString('Adresse må fylles ut'),
  homeTown: requiredString('Hjemby må fylles ut'),
  study: requiredString('Studie må fylles ut'),
  dateOfBirth: requiredIsoDate('Fødselsdato må fylles ut'),
  phone: requiredString('Telefonnummer må fylles ut'),
  cardUuid: z.string(),
})

export type UseUserMigrationWizardFormData = z.input<typeof UserMigrationSchema>
export type UseUserMigrationWizardFormAPIData = z.output<
  typeof UserMigrationSchema
>

export interface UseUserMigrationWizardFormLogicInput {
  defaultValues: UseUserMigrationWizardFormData
  onSubmit: OnFormSubmit<UseUserMigrationWizardFormAPIData, PatchUserReturns>
}
export function useUserMigrationWizardFormLogic(
  input: UseUserMigrationWizardFormLogicInput
) {
  const { defaultValues, onSubmit } = input
  const form = useForm<
    UseUserMigrationWizardFormData,
    unknown,
    UseUserMigrationWizardFormAPIData
  >({
    mode: 'onSubmit',
    defaultValues,
    resolver: zodResolver(UserMigrationSchema),
  })

  async function handleSubmit(data: UseUserMigrationWizardFormAPIData) {
    await onSubmit(data)
  }

  return {
    form,
    onSubmit: handleSubmit,
  }
}
